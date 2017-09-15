// Customize how the browser will display the contents of Thing update messages received
//

function handleMessage(msg) {  // called from within connectAsThing.js
     // display the JSON message in a panel
    document.getElementById('panel').innerHTML = msg;

    // unpack the message and find the sensor values.  Pop a child browser window to display the relevant visualization.
    var requestData ={};
    requestData.metric = JSON.parse(msg).metric;
    requestData.query = JSON.parse(msg).query;

    var kibanaUrl;

    // console.log('This is the value of query: ' + query);
    // console.log('This is the value of metric: ' + metric);

    if (requestData.query == "multiple") {
        switch(requestData.metric) {
            case "temperature":
                kibanaUrl = "<custom Kibana url for temperature data>";
                break;
            case "acceleration":
                kibanaUrl = "<custom Kibana url for acceleration data>";
                break;
            case "humidity":
                kibanaUrl = "<custom Kibana url for humidity data>";
                break;
            case "magnetic field":
                kibanaUrl = "<custom Kibana url for magnetic field data>";
                break;
            case "pressure":
                kibanaUrl = "<custom Kibana url for pressure data>";
                break;
            case "gyroscope":
                kibanaUrl = "<custom Kibana url for gyroscope data>";
                break;
            case "luminosity":
                kibanaUrl = "<custom Kibana url for luminosity data>";
                break;
            default:
                kibanaUrl = "";
            
        }
    }
   
    pop(kibanaUrl);

}
function reloader() {
    location.reload(true);  // hard reload including .js and .css files

}

var childWindow;

function pop(url) {
    console.log('Opening child url ' + url);

    if (childWindow) {
        childWindow.location = url;
    } else {

        childWindow = window.open(
            url,
            'mychild',
            'height=screen.height,width=screen.width,fullscreen=yes,titlebar=yes,toolbar=no,menubar=no,directories=no,status=no,location=yes,title=new'
        );
    }
}