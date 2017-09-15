#### Ingredients
## Amazon IOT <a id="title"></a>

#### What you will learn

Amazon [AWS IoT](https://aws.amazon.com/iot), or Internet of Things, is a set of services to interact with physical things.
A Thing may be a motor, a fan, a robot, etc.

You can start by creating a virtual Thing within AWS that can be controlled by your Lambda code.
Later, you could configure a physical thing, such as an Intel Edison Arduino device, to connect to the IOT network (using certificates) and receive updates to stay in sync with the virtual Thing.
The virtual Thing is known as a "thing shadow".  Read more on the [AWS IOT Thing Shadow Guide](http://docs.aws.amazon.com/iot/latest/developerguide/using-thing-shadows.html).

### Table of Contents (setup steps)
Follow these three steps to build a skill that can update an IOT thing.  Step 3 has you configure a web browser page in place of a real thing.  Once configured, the page will load images of the city you ask for.

1. [setup-thing](setup-thing#title)
1. [update-shadow](update-shadow#title)
1. [webapp-thing](webapp-thing#title)



### Key configuration settings for IOT

When you setup a virtual Thing in a particular region, you will be given the name of an endpoint.
Together with the Thing name and the name of your region, you can uniquely describe your thing.  Both the back-end (Skill Lambda function) and front end (Device or web app) will point to this thing to exchange data.

```
var config = {};
config.IOT_BROKER_ENDPOINT      = "a2eshrcp6u0000.iot.us-east-1.amazonaws.com";  // also called the REST API endpoint
config.IOT_BROKER_REGION        = "us-east-1";  // corresponds to the N.Virginia Region.  Use ```eu-west-1``` instead for the Ireland region
config.IOT_THING_NAME           = "thing1";

```



<hr />
Back to the [Home Page](../../README.md#title)

### Command line scripts configuration
In all the `AWS CLI` scripts included here to automate the development process remember to change the `ARNs` and the `endpoints` with the ones that reflect the `AWS` resources created by you.

