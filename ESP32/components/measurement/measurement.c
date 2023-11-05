#include "measurement.h"

/**
 * @brief Runs a measurement task.
 * This function runs a measurement task that continuously reads a value from a specified sensor interface
 * and stores the result in a shared memory object. The type of measurement to be taken is defined by the
 * measurement_args_t struct passed as an argument, which contains the measurement type, sensor interface,
 * and shared memory object to use.
 * 
 * @param pvParam Pointer to the measurement_args_t struct.
 */
void measurement_task(void* pvParam)
{
    measurement_args_t* args = (measurement_args_t*) pvParam; 
    void* outbuff = create_outbuff(args->m_type);

    args->m_interface.sensor_init(NULL);

    printf("Measurement task\n");

    while(1)
    {
        args->m_interface.sensor_read(outbuff);
        shd_mem_write(args->m_shd_mem, args->m_type, outbuff);
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
    //currently not entering:
    args->m_interface.sensor_delete(NULL);
}


void temporary_reading_task(void* pvParam)
{
    measurement_args_t* args = (measurement_args_t*) pvParam; 
    void* outbuff = create_outbuff(args->m_type);
    
    while(1)
    {
        shd_mem_read(args->m_shd_mem, args->m_type, outbuff);
        printf("Temp: %.2f, Humid: %.2f, Pressure: %.2f\n", ((bme280_readings_t*) outbuff)->temperature_C,
        ((bme280_readings_t*) outbuff)->humidity, ((bme280_readings_t*) outbuff)->pressure_hPa);
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }

}

/**
 * @brief Creates an output buffer for a measurement type.
 * This function creates an output buffer of the appropriate size for a specified measurement type.
 * 
 * @param type The type of measurement for which to create an output buffer.
 * @return void* Pointer to the output buffer.
 */
void* create_outbuff(measurement_type_t type)
{
    void* retval = NULL;
    switch (type)
    {
    case CHAR:
    {
        retval = malloc(sizeof(char));
        break;
    }
    case INT:
    {
        retval = malloc(sizeof(int));
        break;
    }
    case FLOAT:
    {
        retval = malloc(sizeof(float));
        break;
    }
    case DOUBLE:
    {
        retval = malloc(sizeof(double));
        break;
    } 
    case BME280_READINGS:
    {
        retval = malloc(sizeof(bme280_readings_t));
        break;
    }
    case UINT16_T:
    {
        retval = malloc(sizeof(uint16_t));
        break;
    }
    case ALL_MEASUREMENTS:
    {
        retval = malloc(sizeof(shd_mem_t));
        break;
    }
    default:
        break;
    }
    return retval;
}