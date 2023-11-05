#include "mqtt.h"

static const char *TAG = "MQTT";
#define GENERATE_STRING(STRING) #STRING
char macAddress[18];

static esp_mqtt_client_handle_t client;

static void log_error_if_nonzero(const char *message, int error_code)
{
    if (error_code != 0) {
        ESP_LOGE(TAG, "Last error %s: 0x%x", message, error_code);
    }
}

static void parse_and_send(shd_mem_t* shd_ptr, measurement_args_t* args);

/*
 * @brief Event handler registered to receive MQTT events
 *
 *  This function is called by the MQTT client event loop.
 *
 * @param handler_args user data registered to the event.
 * @param base Event base for the handler(always MQTT Base in this example).
 * @param event_id The id for the received event.
 * @param event_data The data for the event, esp_mqtt_event_handle_t.
 */
void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
{
    ESP_LOGD(TAG, "Event dispatched from event loop base=%s, event_id=%" PRIi32 "", base, event_id);
    esp_mqtt_event_handle_t event = event_data;
    esp_mqtt_client_handle_t client = event->client;
    switch ((esp_mqtt_event_id_t)event_id) {
    case MQTT_EVENT_CONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
        break;
    case MQTT_EVENT_DISCONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
        break;
    case MQTT_EVENT_SUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
        break;
    case MQTT_EVENT_UNSUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
        break;
    case MQTT_EVENT_PUBLISHED:
        ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
        break;
    case MQTT_EVENT_DATA:
        ESP_LOGI(TAG, "MQTT_EVENT_DATA");
        printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
        printf("DATA=%.*s\r\n", event->data_len, event->data);
        break;
    case MQTT_EVENT_ERROR:
        ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
        if (event->error_handle->error_type == MQTT_ERROR_TYPE_TCP_TRANSPORT) {
            log_error_if_nonzero("reported from esp-tls", event->error_handle->esp_tls_last_esp_err);
            log_error_if_nonzero("reported from tls stack", event->error_handle->esp_tls_stack_err);
            log_error_if_nonzero("captured as transport's socket errno",  event->error_handle->esp_transport_sock_errno);
            ESP_LOGI(TAG, "Last errno string (%s)", strerror(event->error_handle->esp_transport_sock_errno));

        }
        break;
    default:
        ESP_LOGI(TAG, "Other event id:%d", event->event_id);
        break;
    }
}

void mqtt_app_start(void)
{
    esp_mqtt_client_config_t mqtt_cfg = {
        .uri = MQTT_URI,
        //.host = MQTT_URI,
    };
#if CONFIG_BROKER_URL_FROM_STDIN
    char line[128];

    if (strcmp(mqtt_cfg.broker.address.uri, "FROM_STDIN") == 0) {
        int count = 0;
        printf("Please enter url of mqtt broker\n");
        while (count < 128) {
            int c = fgetc(stdin);
            if (c == '\n') {
                line[count] = '\0';
                break;
            } else if (c > 0 && c < 127) {
                line[count] = c;
                ++count;
            }
            vTaskDelay(10 / portTICK_PERIOD_MS);
        }
        mqtt_cfg.broker.address.uri = line;
        printf("Broker url: %s\n", line);
    } else {
        ESP_LOGE(TAG, "Configuration mismatch: wrong broker url");
        abort();
    }
#endif /* CONFIG_BROKER_URL_FROM_STDIN */

    client = esp_mqtt_client_init(&mqtt_cfg);
    /* The last argument may be used to pass data to the event handler, in this example mqtt_event_handler */
    esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, NULL);
    esp_mqtt_client_start(client);
}

int mqtt_publish(const char* topic, const char* data)
{
    return esp_mqtt_client_publish(client, topic, data, 0, 1, 0);
}

void mqtt_task(void* pvParam)
{
    uint8_t mac[6];
    esp_wifi_get_mac(WIFI_IF_STA, mac);
    snprintf(macAddress, sizeof(macAddress), "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);

    mqtt_app_start();

    measurement_args_t* args = (measurement_args_t*) pvParam; 
    shd_mem_t* outbuff = (shd_mem_t*) create_outbuff(ALL_MEASUREMENTS);
    
    while(1)
    {
        shd_mem_read(args->m_shd_mem, ALL_MEASUREMENTS, outbuff);
        parse_and_send(outbuff, args);

        vTaskDelay(4000 / portTICK_PERIOD_MS);
    }
}


static void parse_and_send(shd_mem_t* shd_ptr, measurement_args_t* args)
{
    char msg[150];
    sprintf(msg, "temperature,%d,Light,1697879661431,%d", args->m_interface.sensor_ref, (int)shd_ptr->bme280_val.temperature_C);
    mqtt_publish(MQTT_TOPIC, msg);
    puts(msg);
    //memset(msg,"");
    sprintf(msg, "humidity,%d,Light,1697879661431,%d", args->m_interface.sensor_ref, (int)shd_ptr->bme280_val.humidity);
    mqtt_publish(MQTT_TOPIC, msg);
    puts(msg);
    sprintf(msg, "pressure,%d,Light,1697879661431,%d", args->m_interface.sensor_ref, (int)shd_ptr->bme280_val.pressure_hPa);
    mqtt_publish(MQTT_TOPIC, msg);
    puts(msg);
    //extern char* hostname;
    //sprintf(msg, "{\"ID\":\"%s\",\"SENSOR\":\"%s\",\"DATA\":[{\"TEMP\":%.2f},{\"HUMID\":%.2f},{\"PRESS\":%.2f}]}", 
    //macAddress, GENERATE_STRING(BME280), shd_ptr->bme280_val.temperature_C, shd_ptr->bme280_val.humidity, shd_ptr->bme280_val.pressure_hPa);
    //sprintf(msg, "{\"ID\":\"%s\", \"SENSOR\":\"%s\", \"DATA\":[{\"LUX\":%u}]}", 
    //macAddress, GENERATE_STRING(BH1750), shd_ptr->bh1750_val);
    

         
}