#ifndef __BH_1750_INTERFACE_H__
#define __BH_1750_INTERFACE_H__

#include <stdio.h>
#include "esp_log.h"
#include "esp_err.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

/*  BH1750 components  */
#include "bh1750.h"
#include "bh1750_i2c_hal.h"

#define TAG_BH1750 "BH1750"

void inter_bh1750_init(void* args);

void inter_bh1750_delete(void* args);

void inter_bh1750_read(void* out_buff);

#endif







