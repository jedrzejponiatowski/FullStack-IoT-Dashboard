#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"

#include "lwip/err.h"
#include "lwip/sys.h"

#include "measurement.h"
#include "wifi.h"

void i2c_master_init();


#include "measurement.h"
#include "shared_mem.h"
#include "mqtt.h"

void app_main(void)
{
    printf("Main start\n");

    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
      ESP_ERROR_CHECK(nvs_flash_erase());
      ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    ESP_LOGI("ESP_WIFI", "ESP_WIFI_MODE_STA");
    wifi_init_sta();

    vTaskDelay( 3000 / portTICK_PERIOD_MS);

    i2c_master_init();
    shd_mem_t* shared_memory = shd_mem_create();

    measurement_args_t args= 
    {
        .m_shd_mem = shared_memory,
        .m_type = BME280_READINGS,
        .m_interface = 
        {
            .sensor_ref = BME280_DNG_11803,
            .sensor_init = inter_bme280_init_,
            .sensor_delete = inter_bme280_delete,
            .sensor_read = inter_bme280_read
        }
    };

    /*measurement_args_t args=
    {
        .m_shd_mem = shared_memory,
        .m_type = UINT16_T,
        .m_interface = 
        {
            .sensor_init = inter_bh1750_init,
            .sensor_delete = inter_bh1750_delete,
            .sensor_read = inter_bh1750_read
        }
    };*/

	xTaskCreate(&measurement_task, "BME280 task",  4096, (void*)&args , 1, NULL);
	//xTaskCreate(&measurement_task, "BH1750 task",  4096, (void*)&args , 1, NULL);
    xTaskCreate(&mqtt_task, "MQTT task",  4096, (void*)&args , 1, NULL);

    while(1) 
    {
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
    
}


void i2c_master_init()
{
	i2c_config_t i2c_config = {
		.mode = I2C_MODE_MASTER,
		.sda_io_num = SDA_PIN,
		.scl_io_num = SCL_PIN,
		.sda_pullup_en = GPIO_PULLUP_ENABLE,
		.scl_pullup_en = GPIO_PULLUP_ENABLE,
		.master.clk_speed = 1000000
	};
	i2c_param_config(I2C_NUM_0, &i2c_config);
	i2c_driver_install(I2C_NUM_0, I2C_MODE_MASTER, 0, 0, 0);
}
