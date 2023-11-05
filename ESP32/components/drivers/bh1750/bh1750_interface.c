#include "bh1750_interface.h"

bh1750_dev_t dev_1;
esp_err_t err;

void inter_bh1750_init(void* args)
{
    //bh1750_i2c_hal_init();

    /* Device init */
    dev_1.i2c_addr = I2C_ADDRESS_BH1750;
    dev_1.mtreg_val = DEFAULT_MEAS_TIME_REG_VAL;

    /* Perform device reset */
    err = bh1750_i2c_dev_reset(dev_1); 
    ESP_LOGI(TAG_BH1750, "Device reset: %s", err == BH1750_OK ? "Successful" : "Failed");

    err += bh1750_i2c_set_power_mode(dev_1, BH1750_POWER_ON);
    ESP_LOGI(TAG_BH1750, "Changing power mode to ON: %s", err == BH1750_OK ? "Successful" : "Failed");

    /* Change measurement time with  50% optical window transmission rate */
    err += bh1750_i2c_set_mtreg_val(&dev_1, 50);
    ESP_LOGI(TAG_BH1750, "Changing measurement time: %s", err == BH1750_OK ? "Successful" : "Failed");

    /* Configure device */
    err += bh1750_i2c_set_resolution_mode(&dev_1, BH1750_CONT_H_RES_MODE);
    if (err == BH1750_OK)
    {
        ESP_LOGI(TAG_BH1750, "BH1750 config successful");
    }
    else{
        ESP_LOGE(TAG_BH1750, "BH1750 config failed!");
    }
    /* End of device config */

}

void inter_bh1750_delete(void* args) 
{
    return;
}

void inter_bh1750_read(void* out_buff)
{
    // ESP_LOGI(TAG_BH1750, "BH1750 initialization successful");
    if (err == BH1750_OK)
    {
        //Start reading data
        uint16_t retval;
        bh1750_i2c_read_data(dev_1, &retval);
        *(uint16_t *)out_buff = retval;
        //printf("Light Intensity: %d Lux\n", retval);
        bh1750_i2c_hal_ms_delay(1000);
    }
    else{
        ESP_LOGE(TAG_BH1750, "measue error!");
    }
}