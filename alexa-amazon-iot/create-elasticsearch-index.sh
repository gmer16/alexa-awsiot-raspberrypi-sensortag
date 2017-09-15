curl -XPUT <your es endpoint>/<domain> -d '{
"mappings": {
    "raspberrypi-gateway": {
      "properties": {
        "state": {
          "properties": {
            "desired": {
              "properties": {
                "timestamp": {
                  "type": "date",
                  "format": "epoch_millis"
                },
                "objectTemperature": {
                  "type": "float"
                },
                "ambientTemperature": {
                  "type": "float"
                },
                "accelerometerX": {
                  "type": "float"
                },
                "accelerometerY": {
                  "type": "float"
                },
                "accelerometerZ": {
                  "type": "float"
                },
                "humidity": {
                  "type": "float"
                },
                "magnetometerX": {
                  "type": "float"
                },
                "magnetometerY": {
                  "type": "float"
                },
                "magnetometerZ": {
                  "type": "float"
                },
                "barometricPressure": {
                  "type": "float"
                },
                "gyroscopeX": {
                  "type": "float"
                },
                "gyroscopeY": {
                  "type": "float"
                },
                "gyroscopeZ": {
                  "type": "float"
                },
                "luxometer": {
                  "type": "float"
                }
              }
            }
          }
        }
      }
    }
  }
}'
