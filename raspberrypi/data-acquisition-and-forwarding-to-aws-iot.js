var util = require('util');

var async = require('async');

var awsIot = require('aws-iot-device-sdk');

var SensorTag = require('sensortag');

var USE_READ = true; 

SensorTag.discover(function(sensorTag) {
  console.log('discovered: ' + sensorTag);

  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
  });

  //
  // Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
  // with a unique client identifier and custom host endpoint provided in AWS IoT cloud
  // NOTE: client identifiers must be unique within your AWS account; if a client attempts 
  // to connect with a client identifier which is already in use, the existing 
  // connection will be terminated.
  //
  var thingShadows = awsIot.thingShadow({
    keyPath: "../security/privateKey.pem",
    certPath: "../security/cert.pem",
      caPath: "../security/rootca.pem",
    clientId: "raspberrypi-gateway",
        host: "XXXXXXXXXXXXX.eu-west-1.amazonaws.com"
  });

  var clientTokenUpdate;

  var sensorData = {"state":{"desired":{},"reported":{}}};

  async.series([
    function(callback) {
      console.log('connectAndSetUp');
      sensorTag.connectAndSetUp(callback);
    },
    function(callback) {
      console.log('readDeviceName');
      sensorTag.readDeviceName(function(error, deviceName) {
        console.log('\tdevice name = ' + deviceName);
        callback();
      });
    },
    function(callback) {
      console.log('readSystemId');
      sensorTag.readSystemId(function(error, systemId) {
        console.log('\tsystem id = ' + systemId);
        callback();
      });
    },
    function(callback) {
      console.log('readSerialNumber');
      sensorTag.readSerialNumber(function(error, serialNumber) {
        console.log('\tserial number = ' + serialNumber);
        callback();
      });
    },
    function(callback) {
      console.log('readFirmwareRevision');
      sensorTag.readFirmwareRevision(function(error, firmwareRevision) {
        console.log('\tfirmware revision = ' + firmwareRevision);
        callback();

      });
    },
    function(callback) {
      console.log('readHardwareRevision');
      sensorTag.readHardwareRevision(function(error, hardwareRevision) {
        console.log('\thardware revision = ' + hardwareRevision);
        callback();
      });
    },
    function(callback) {
      console.log('readSoftwareRevision');
      sensorTag.readHardwareRevision(function(error, softwareRevision) {
        console.log('\tsoftware revision = ' + softwareRevision);
        callback();
      });
    },
    function(callback) {
      console.log('readManufacturerName');
      sensorTag.readManufacturerName(function(error, manufacturerName) {
        console.log('\tmanufacturer name = ' + manufacturerName);
        callback();
      });
    }], 
    function(err) {}
  );

  thingShadows.register( 'raspberrypi-gateway', {}, function() {
    async.forever(
      function(next) {

        sensorData.state.desired.timestamp = Date.now();

        async.series([
            function(callback) {
              console.log('enableIrTemperature');
              sensorTag.enableIrTemperature(callback);
            },
            function(callback) {
              setTimeout(callback, 2000);
            },
            function(callback) {
              if (USE_READ) {
                console.log('readIrTemperature');
                sensorTag.readIrTemperature(function(error, objectTemperature, ambientTemperature) {
                  console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
                  console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));
                  sensorData.state.desired.objectTemperature = objectTemperature;
                  sensorData.state.desired.ambientTemperature = ambientTemperature;
                  callback();
                });
              } else {
                sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
                  console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
                  console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));
                });

                console.log('setIrTemperaturePeriod');
                sensorTag.setIrTemperaturePeriod(500, function(error) {
                  console.log('notifyIrTemperature');
                  sensorTag.notifyIrTemperature(function(error) {
                    setTimeout(function() {
                      console.log('unnotifyIrTemperature');
                      sensorTag.unnotifyIrTemperature(callback);
                    }, 5000);
                  });
                });
              }
            },
            function(callback) {
              console.log('disableIrTemperature');
              sensorTag.disableIrTemperature(callback);
            },
            function(callback) {
              console.log('enableAccelerometer');
              sensorTag.enableAccelerometer(callback);
            },
            function(callback) {
              setTimeout(callback, 2000);
            },
            function(callback) {
              if (USE_READ) {
                console.log('readAccelerometer');
                sensorTag.readAccelerometer(function(error, x, y, z) {
                  console.log('\tx = %d G', x.toFixed(1));
                  console.log('\ty = %d G', y.toFixed(1));
                  console.log('\tz = %d G', z.toFixed(1));
                  
                  sensorData.state.desired.accelerometerX = x;
                  sensorData.state.desired.accelerometerY = y;
                  sensorData.state.desired.accelerometerZ = z;
                  callback();
                });
              } else {
                sensorTag.on('accelerometerChange', function(x, y, z) {
                  console.log('\tx = %d G', x.toFixed(1));
                  console.log('\ty = %d G', y.toFixed(1));
                  console.log('\tz = %d G', z.toFixed(1));
                });

                console.log('setAccelerometerPeriod');
                sensorTag.setAccelerometerPeriod(500, function(error) {
                  console.log('notifyAccelerometer');
                  sensorTag.notifyAccelerometer(function(error) {
                    setTimeout(function() {
                      console.log('unnotifyAccelerometer');
                      sensorTag.unnotifyAccelerometer(callback);
                    }, 5000);
                  });
                });
              }
            },
            function(callback) {
              console.log('disableAccelerometer');
              sensorTag.disableAccelerometer(callback);
            },
            function(callback) {
              console.log('enableHumidity');
              sensorTag.enableHumidity(callback);
            },
            function(callback) {
              setTimeout(callback, 2000);
            },
            function(callback) {
              if (USE_READ) {
                console.log('readHumidity');
                sensorTag.readHumidity(function(error, temperature, humidity) {
                  console.log('\ttemperature = %d °C', temperature.toFixed(1));
                  console.log('\thumidity = %d %', humidity.toFixed(1));
                  
                  sensorData.state.desired.humidity = humidity;
                  callback();
                });
              } else {
                sensorTag.on('humidityChange', function(temperature, humidity) {
                  console.log('\ttemperature = %d °C', temperature.toFixed(1));
                  console.log('\thumidity = %d %', humidity.toFixed(1));
                });

                console.log('setHumidityPeriod');
                sensorTag.setHumidityPeriod(500, function(error) {
                  console.log('notifyHumidity');
                  sensorTag.notifyHumidity(function(error) {
                    setTimeout(function() {
                      console.log('unnotifyHumidity');
                      sensorTag.unnotifyHumidity(callback);
                    }, 5000);
                  });
                });
              }
            },
            function(callback) {
              console.log('disableHumidity');
              sensorTag.disableHumidity(callback);
            },
            function(callback) {
              console.log('enableMagnetometer');
              sensorTag.enableMagnetometer(callback);
            },
            function(callback) {
              setTimeout(callback, 2000);
            },
            function(callback) {
              if (USE_READ) {
                console.log('readMagnetometer');
                sensorTag.readMagnetometer(function(error, x, y, z) {
                  console.log('\tx = %d μT', x.toFixed(1));
                  console.log('\ty = %d μT', y.toFixed(1));
                  console.log('\tz = %d μT', z.toFixed(1));
                  
                  sensorData.state.desired.magnetometerX = x;
                  sensorData.state.desired.magnetometerY = y;
                  sensorData.state.desired.magnetometerZ = z;
                  callback();
                });
              } else {
                sensorTag.on('magnetometerChange', function(x, y, z) {
                  console.log('\tx = %d μT', x.toFixed(1));
                  console.log('\ty = %d μT', y.toFixed(1));
                  console.log('\tz = %d μT', z.toFixed(1));
                });

                console.log('setMagnetometerPeriod');
                sensorTag.setMagnetometerPeriod(500, function(error) {
                  console.log('notifyMagnetometer');
                  sensorTag.notifyMagnetometer(function(error) {
                    setTimeout(function() {
                      console.log('unnotifyMagnetometer');
                      sensorTag.unnotifyMagnetometer(callback);
                    }, 5000);
                  });
                });
              }
            },
            function(callback) {
              console.log('disableMagnetometer');
              sensorTag.disableMagnetometer(callback);
            },
            function(callback) {
              console.log('enableBarometricPressure');
              sensorTag.enableBarometricPressure(callback);
            },
            function(callback) {
              setTimeout(callback, 2000);
            },
            function(callback) {
              if (USE_READ) {
                console.log('readBarometricPressure');
                sensorTag.readBarometricPressure(function(error, pressure) {
                  console.log('\tpressure = %d mBar', pressure.toFixed(1));
                  
                  sensorData.state.desired.barometricPressure =  pressure;
                  callback();
                });
              } else {
                sensorTag.on('barometricPressureChange', function(pressure) {
                  console.log('\tpressure = %d mBar', pressure.toFixed(1));
                });

                console.log('setBarometricPressurePeriod');
                sensorTag.setBarometricPressurePeriod(500, function(error) {
                  console.log('notifyBarometricPressure');
                  sensorTag.notifyBarometricPressure(function(error) {
                    setTimeout(function() {
                      console.log('unnotifyBarometricPressure');
                      sensorTag.unnotifyBarometricPressure(callback);
                    }, 5000);
                  });
                });
              }
            },
            function(callback) {
              console.log('disableBarometricPressure');
              sensorTag.disableBarometricPressure(callback);
            },
            function(callback) {
              console.log('enableGyroscope');
              sensorTag.enableGyroscope(callback);
            },
            function(callback) {
              setTimeout(callback, 2000);
            },
            function(callback) {
              if (USE_READ) {
                console.log('readGyroscope');
                sensorTag.readGyroscope(function(error, x, y, z) {
                  console.log('\tx = %d °/s', x.toFixed(1));
                  console.log('\ty = %d °/s', y.toFixed(1));
                  console.log('\tz = %d °/s', z.toFixed(1));
                  
                  sensorData.state.desired.gyroscopeX = x;
                  sensorData.state.desired.gyroscopeY = y;
                  sensorData.state.desired.gyroscopeZ = z;
                  callback();
                });
              } else {
                sensorTag.on('gyroscopeChange', function(x, y, z) {
                  console.log('\tx = %d °/s', x.toFixed(1));
                  console.log('\ty = %d °/s', y.toFixed(1));
                  console.log('\tz = %d °/s', z.toFixed(1));
                });

                console.log('setGyroscopePeriod');
                sensorTag.setGyroscopePeriod(500, function(error) {
                  console.log('notifyGyroscope');
                  sensorTag.notifyGyroscope(function(error) {
                    setTimeout(function() {
                      console.log('unnotifyGyroscope');
                      sensorTag.unnotifyGyroscope(callback);
                    }, 5000);
                  });
                });
              }
            },
            function(callback) {
              console.log('disableGyroscope');
              sensorTag.disableGyroscope(callback);
            },
            function(callback) {
              if (sensorTag.type === 'cc2540') {
                async.series([
                  function(callback) {
                    console.log('readTestData');
                    sensorTag.readTestData(function(error, data) {
                      console.log('\tdata = ' + data);

                      callback();
                    });
                  },
                  function(callback) {
                    console.log('readTestConfiguration');
                    sensorTag.readTestConfiguration(function(error, configuration) {
                      console.log('\tconfiguration = ' + configuration);

                      callback();
                    });
                  },
                  function() {
                    callback();
                  }
                ]);
              } else if (sensorTag.type === 'cc2650') {
                async.series([
                  function(callback) {
                    console.log('readIoData');
                    sensorTag.readIoData(function(error, value) {
                      console.log('\tdata = ' + value);

                      console.log('writeIoData');
                      sensorTag.writeIoData(value, callback);
                    });
                  },
                  function(callback) {
                    console.log('readIoConfig');
                    sensorTag.readIoConfig(function(error, value) {
                      console.log('\tconfig = ' + value);

                      console.log('writeIoConfig');
                      sensorTag.writeIoConfig(value, callback);
                    });
                  },
                  function(callback) {
                    console.log('enableLuxometer');
                    sensorTag.enableLuxometer(callback);
                  },
                  function(callback) {
                    setTimeout(callback, 2000);
                  },
                  function(callback) {
                    if (USE_READ) {
                      console.log('readLuxometer');
                      sensorTag.readLuxometer(function(error, lux) {
                        console.log('\tlux = %d', lux.toFixed(1));
                        
                        sensorData.state.desired.luxometer = lux;
                        callback();
                      });
                    } else {
                      sensorTag.on('luxometerChange', function(lux) {
                        console.log('\tlux = %d', lux.toFixed(1));
                      });

                      console.log('setLuxometer');
                      sensorTag.setLuxometerPeriod(500, function(error) {
                        console.log('notifyLuxometer');
                        sensorTag.notifyLuxometer(function(error) {
                          setTimeout(function() {
                            console.log('unnotifyLuxometer');
                            sensorTag.unnotifyLuxometer(callback);
                          }, 5000);
                        });
                      });
                    }
                  },
                  function(callback) {
                    console.log('disableLuxometer');
                    sensorTag.disableLuxometer(callback);
                  },
                  function() {
                    callback();
                  }
                ]);
              } else {
                callback();
              }
            }, 
            function(callback) {
              console.log(sensorData);
              var newData = JSON.parse(JSON.stringify(sensorData));

              console.log('Accessing AWS IoT servers .....');

              setTimeout(function() {
                console.log('Updating SensorTag shadow state ... ');
                clientTokenUpdate = thingShadows.update('raspberrypi-gateway', newData);
                console.log('Update:' + clientTokenUpdate);
                if (clientTokenUpdate === null)
                {
                    console.log('update shadow failed, operation still in progress');
                }
                  else {
                    next();
                }
              }, 10000);
            }
          ], 
          function(err) { // async.series
            // In case any of the series functions aborts execution the process will be retried
            next();
            });
        },
        function(error) { // async.forever
          console.log('Client closing ....');
          process.exit(0);

        }
    );
      // data logging
    thingShadows.on('status', 
        function(thingName, stat, clientToken, stateObject) {
          console.log('received '+stat+' on '+thingName+': '+
                      JSON.stringify(stateObject));
        });

    thingShadows.on('delta', 
        function(thingName, stateObject) {
          console.log('received delta on '+thingName+': '+
                      JSON.stringify(stateObject));
        });

    thingShadows.on('timeout',
        function(thingName, clientToken) {
          console.log('received timeout on '+thingName+
                      ' with token: '+ clientToken);
        });

    thingShadows.on('rejected',
        function(thingName, clientToken) {
          console.log('update rejected on '+thingName+
                      ' with token: '+ clientToken);
        });
    
    thingShadows.on('accepted',
        function(thingName, clientToken) {
          console.log('update accepted on '+thingName+
                      ' with token: '+ clientToken);
        });
      }
    );

  });
