#include "shared_mem.h"


#define SHD_MEM_TAG "Shared mamory"

SemaphoreHandle_t xMutex = NULL;

/**
 * @brief This function creates a shared memory object for measurements and initializes a mutex for synchronizing access to the shared memory.
 * 
 * @return m_shd_mem_t* : A pointer to the shared memory object, or NULL if the memory allocation or mutex creation fails.
 */
shd_mem_t* shd_mem_create(void)
{
    shd_mem_t* shd_ptr = malloc( sizeof(shd_mem_t));
    if (NULL == shd_ptr)
    {
        ESP_LOGE(SHD_MEM_TAG, "Can not allocate shared memory!\n");
        return NULL;
    }

    xMutex = xSemaphoreCreateMutex();
    if (NULL == xMutex)
    {
        ESP_LOGE(SHD_MEM_TAG, "Can not create mutex!\n");
        return NULL;
    }

    return shd_ptr;
}

/**
 * @brief This function writes a measurement value to the shared memory.
 * 
 * @param shd_mem : A pointer to the shared memory object.
 * @param m_type : The type of measurement to be written.
 * @param in_buff : A pointer to the measurement value to be written.
 */
void shd_mem_write(shd_mem_t* shd_mem, measurement_type_t m_type, void* in_buff)
{
    switch(m_type)
    {
        case BME280_READINGS:
        {
            xSemaphoreTake(xMutex, portMAX_DELAY);
            shd_mem->bme280_val = *( (bme280_readings_t*) in_buff);
            xSemaphoreGive(xMutex); 
            break;
        }
        case UINT16_T:
        { 
            xSemaphoreTake(xMutex, portMAX_DELAY);
            shd_mem->bh1750_val = *( (uint16_t*) in_buff);
            xSemaphoreGive(xMutex);
            break;
        }
        case ALL_MEASUREMENTS:
        {
            xSemaphoreTake(xMutex, portMAX_DELAY);
            *shd_mem = *( (shd_mem_t*) in_buff);
            xSemaphoreGive(xMutex); 
            break;
        }
        default:
            break;
    }
}


/**
 * @brief This function reads a measurement value from the shared memory.
 * 
 * @param shd_mem : A pointer to the shared memory object.
 * @param m_type : The type of measurement to be read.
 * @param out_buff : A pointer to the buffer where the measurement value will be stored.
 */
void shd_mem_read(const shd_mem_t* shd_mem, measurement_type_t m_type, void* out_buff)
{
    switch (m_type)
    {
        case BME280_READINGS:
        {
            xSemaphoreTake(xMutex, portMAX_DELAY);
            *( (bme280_readings_t*) out_buff ) = shd_mem->bme280_val;
            xSemaphoreGive(xMutex); 
            break;
        }
        case UINT16_T:
        {
            xSemaphoreTake(xMutex, portMAX_DELAY);
            *( (uint16_t*) out_buff ) = shd_mem->bh1750_val;
            xSemaphoreGive(xMutex); 
            break;
        }
        case ALL_MEASUREMENTS:
        {
            xSemaphoreTake(xMutex, portMAX_DELAY);
            *( (shd_mem_t*) out_buff ) = *shd_mem;
            xSemaphoreGive(xMutex); 
            break;  
        }
        default:
            break;
    }
}