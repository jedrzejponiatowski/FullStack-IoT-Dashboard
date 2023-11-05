#ifndef __MEASUREMENT_H__
#define __MEASUREMENT_H__

#include "shared_mem.h"

/**
 * @brief Struct defining the arguments needed for a measurement task.
 * This struct defines the arguments required for a measurement task,
 * including the measurement type, sensor interface and shared memory object.
 */
typedef struct measurement_args_t
{
    measurement_type_t m_type;
    sensor_interface_t m_interface;
    shd_mem_t*         m_shd_mem;
} measurement_args_t;

/**
 * @brief Runs a measurement task.
 * This function runs a measurement task that continuously reads a value from a specified sensor interface
 * and stores the result in a shared memory object. The type of measurement to be taken is defined by the
 * measurement_args_t struct passed as an argument, which contains the measurement type, sensor interface,
 * and shared memory object to use.
 * 
 * @param pvParam Pointer to the measurement_args_t struct.
 */
void measurement_task(void* args);

void temporary_reading_task(void* pvParam);

/**
 * @brief Creates an output buffer for a measurement type.
 * This function creates an output buffer of the appropriate size for a specified measurement type.
 * 
 * @param type The type of measurement for which to create an output buffer.
 * @return void* Pointer to the output buffer.
 */
void* create_outbuff(measurement_type_t type);





#endif