// alexa-cookbook sample code

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
//  or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.


// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

var config = {};
config.IOT_SELECTOR_BROKER_ENDPOINT      = "a1b84qjcp5ts6l.iot.eu-west-1.amazonaws.com";  // also called the REST API endpoint
config.IOT_SELECTOR_BROKER_REGION        = "eu-west-1";  // eu-west-1 corresponds to the Ireland Region.  Use eu-west-1 for the N. Virginia region
config.IOT_SELECTOR_THING_NAME           = "thing1";
config.IOT_SENSOR_BROKER_ENDPOINT      = "a1b84qjcp5ts6l.iot.eu-west-1.amazonaws.com";  // also called the REST API endpoint
config.IOT_SENSOR_BROKER_REGION        = "eu-west-1";  // eu-west-1 corresponds to the Ireland Region.  Use eu-west-1 for the N. Virginia region
config.IOT_SENSOR_THING_NAME           = "sensortag-client-ios-app";

var SkillMessagesUS = {
    'welcome'       :'welcome.  you can ask for different sensor readings, like temperature, pressure, luminosity and others',
    'metricresponse': 'you asked for information about',
    'historicalmetricresponse': 'here is a summary of the latest values of ',
    'temperatureresponse': 'the ambient temperature right now is',
    'accelerationresponse': 'the device acceleration values right now are the following',
    'humidityresponse': 'the humidity is',
    'magneticfieldresponse': 'the magnetic field values right now are the following',
    'pressureresponse': 'the barometric pressure is',
    'gyroscoperesponse': 'the current gyroscope readings right now are the following',
    'luminosityresponse': 'the ambient luminosity is',
    'help'          :'you can say things like, go to london or go to berlin',
    'cancel'        :'goodbye',
    'stop'          :'goodbye'
};

var SkillMessagesDE = {
    'welcome'       :'welcome.  you can ask for different sensor readings, like temperature, pressure, luminosity and others',
    'metricresponse': 'you asked for information about',
    'historicalmetricresponse': 'here is a summary of the latest values of ',
    'temperatureresponse': 'the ambient temperature right now is',
    'accelerationresponse': 'the device acceleration values right now are',
    'humidityresponse': 'the humidity is',
    'magneticfieldresponse': 'the magnetic field values are',
    'pressureresponse': 'the barometric pressure is',
    'gyroscoperesponse': 'the current gyroscope readings are',
    'luminosityresponse': 'the ambient luminosity is', 
    'help'          :'sagen so was, reisen nach london oder reisen nach berlin',
    'cancel'        :'auf wiedersehen',
    'stop'          :'auf wiedersehen'
};

// 2. Skill Code =======================================================================================================


var Alexa = require('alexa-sdk');
var SkillMessages = {};
var states = {
    STARTCYCLE: '_STARTCYCLE', // User is inquiring for a new metric
    ENDCYCLE: '_ENDCYCLE'  // Prompt the user to start or restart the game.
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes

    var locale = event.request.locale;

    console.log('locale is set to ' + locale);

    switch(locale) {
        case 'de-DE':
            SkillMessages = SkillMessagesDE;
            break;
        default:
            SkillMessages = SkillMessagesUS;
            break;
    }

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var promptQueue =[];

var handlers = {
    'LaunchRequest': function () {
        this.handler.state = states.INTRO;
        promptQueue.length = 0;
        this.emit(':ask', SkillMessages.welcome, 'try again');
    },

    'SimpleQueryIntent': function () {

        var myMetric = this.event.request.intent.slots.metric.value;

        if (myMetric == null) { // no slot
            say = SkillMessages.help;
        } else {

            say =  SkillMessages.metricresponse + ' ' + myMetric;
        };

        newState = {"metric":myMetric,"query":"single"};

        promptQueue.push(say);
        
        updateSelectorShadow(newState, status => {});

        var lastSensorData;

        getSensorShadow(result => {
            lastSensorData = result;
            console.log(lastSensorData);
            console.log('These are the latest values retrieved by the SensorTag' + lastSensorData);
            if (lastSensorData == null) { // no slot
                say = SkillMessages.help;
            } else {
                switch(myMetric) {
                    case "temperature":
                        say = SkillMessages.temperatureresponse + ' ' + lastSensorData.ambientTemperature;
                        console.log("inside the switch statement");
                        break;
                    case "acceleration":
                        say = SkillMessages.accelerationresponse + ' ' + 'on the x direction' + ' ' + lastSensorData.accelerometerX + ' ' + 'on the y direction' + ' ' + lastSensorData.accelerometerY + ' ' + 'on the z direction' + ' ' + lastSensorData.accelerometerZ;
                        break;
                    case "humidity":
                        say = SkillMessages.humidityresponse + ' ' + lastSensorData.humidity;
                        break;
                    case "magnetic field":
                        say = SkillMessages.magneticfieldresponse + ' ' + 'on the x direction' + ' ' + lastSensorData.magnetometerX + ' ' + 'on the y direction' + ' ' + lastSensorData.magnetometerY + ' ' + 'on the z direction' + ' ' + lastSensorData.magnetometerZ;
                        break;
                    case "pressure":
                        say = SkillMessages.pressureresponse + ' ' + lastSensorData.barometricPressure;
                        break;
                    case "gyroscope":
                        say = SkillMessages.gyroscoperesponse + ' ' + 'on the x direction' + ' ' + lastSensorData.gyroscopeX + ' ' + 'on the y direction' + ' ' + lastSensorData.gyroscopeY + ' ' + 'on the z direction' + ' ' + lastSensorData.gyroscopeZ;
                        break;
                    case "luminosity":
                        say = SkillMessages.luminosityresponse + ' ' + lastSensorData.luxometer;
                        break;
                    default:
                }
            }
            promptQueue.push(say);
            this.emit('SynthesizeAnswerIntent');
        });

    },

    'HistoricalQueryIntent': function () {

        var myMetric = this.event.request.intent.slots.metric.value;

        if (myMetric == null) { // no slot
            say = SkillMessages.help;
        } else {

            say =  SkillMessages.historicalmetricresponse + ' ' + myMetric;
        };

        newState = {"metric":myMetric,"query":"multiple"};

        updateSelectorShadow(newState, status => {
            this.emit(':tell', SkillMessages.historicalmetricresponse + ' ' + myMetric);
        });

        // .... then here emit speech to introduce the different types of historical data

    },
    'SynthesizeAnswerIntent': function () {
        var outputMessage = [];
        outputMessage = promptQueue.slice();
        promptQueue.length = 0;
        this.handler.state = states.SYNTHESIZE_ANSWER;
        this.emit(':ask', outputMessage.join(" "));
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', SkillMessages.help, SkillMessages.help);

    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', SkillMessages.stop, SkillMessages.stop);

    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', SkillMessages.cancel, SkillMessages.cancel);

    },

};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================


function updateSelectorShadow(desiredState, callback) {
    // update AWS IOT thing shadow
    var AWS = require('aws-sdk');
    AWS.config.region = config.IOT_SELECTOR_BROKER_REGION;

    //Prepare the parameters of the update call

    var paramsUpdate = {
        "thingName" : config.IOT_SELECTOR_THING_NAME,
        "payload" : JSON.stringify(
            { "state":
                { "desired": desiredState             // {"pump":1}
                }
            }
        )
    };

    var iotData = new AWS.IotData({endpoint: config.IOT_SELECTOR_BROKER_ENDPOINT});

    iotData.updateThingShadow(paramsUpdate, function(err, data)  {
        if (err){
            console.log(err);

            callback("not ok");
        }
        else {
            console.log("updated thing shadow " + config.IOT_SELECTOR_THING_NAME + ' to state ' + paramsUpdate.payload);
            callback("ok");
        }

    });

}




function getSensorShadow(callback) {
    // update AWS IOT thing shadow
    var AWS = require('aws-sdk');
    AWS.config.region = config.IOT_SENSOR_BROKER_REGION;

    //Prepare the parameters of the update call

    var iotData = new AWS.IotData({endpoint: config.IOT_SENSOR_BROKER_ENDPOINT});

    var paramsGet = {
        thingName: config.IOT_SENSOR_THING_NAME /* required */
    };

    iotData.getThingShadow(paramsGet, function(err, data)  {
        if (err){
            console.log(err);

            callback("not ok");
        }
        else {
            console.log("retrieved information from sensor thing shadow");

            var sensorObject = JSON.parse(data.payload).state.desired;
            console.log(sensorObject);
            callback(sensorObject);

        }

    });

}
