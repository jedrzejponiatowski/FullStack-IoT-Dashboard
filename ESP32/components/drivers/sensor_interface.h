#ifndef __SENSOR_INTERFACE_H__
#define __SENSOR_INTERFACE_H__

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "bme280_interface.h"
#include "bh1750_interface.h"

typedef enum measurement_type_t
{
    CHAR = 0,
    INT,
    FLOAT,
    DOUBLE,
    BME280_READINGS,
    UINT16_T,
    ALL_MEASUREMENTS
} measurement_type_t;

typedef struct sensor_interface_t
{
    void (*sensor_init)(void* args);
    void (*sensor_delete)(void* args);
    void (*sensor_read)(void* out_buff);
} sensor_interface_t;



#endif