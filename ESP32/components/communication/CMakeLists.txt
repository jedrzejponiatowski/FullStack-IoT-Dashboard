idf_component_register(SRC_DIRS "." "wifi" "mqtt"
                       INCLUDE_DIRS  "." "wifi" "mqtt"
                       REQUIRES "nvs_flash" mqtt "measurement")
