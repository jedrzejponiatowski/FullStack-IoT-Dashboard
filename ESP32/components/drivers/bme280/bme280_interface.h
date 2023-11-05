#ifndef __BME_280_INTERFACE_H__
#define __BME_280_INTERFACE_H__
#include "driver/gpio.h"
#include "driver/i2c.h"
#include "esp_err.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "bme280.h"

#define SDA_PIN GPIO_NUM_21
#define SCL_PIN GPIO_NUM_22

#define I2C_MASTER_ACK 0
#define I2C_MASTER_NACK 1

#if CONFIG_BME280_I2C_ADDRESS1
#define BME280_I2C_ADDRESS                  (0x76)
#elif CONFIG_BME280_I2C_ADDRESS2
#define BME280_I2C_ADDRESS                  (0x77)
#endif

#define TAG_BME280 "BME280"

typedef struct bme280_readings_t
{
    float temperature_C;
    float pressure_hPa;
    float humidity;
} bme280_readings_t;

void inter_bme280_init_(void* args);

void inter_bme280_delete(void* args);

void inter_bme280_read(void* out_buff);






#endif