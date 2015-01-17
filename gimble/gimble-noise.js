// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This ambient module example console.logs
ambient light and sound levels and whenever a
specified light or sound level trigger is met.
*********************************************/

var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var servolib = require('servo-pca9685');

var ambient = ambientlib.use(tessel.port['C']);
var servo1 = 2;
var servo = servolib.use(tessel.port['B']);

ambient.on('ready', function () {

  servo.on('ready', function () {
      console.log("Servo Ready");

      accel.setOutputRate(100, function() {
        console.log("set output rate");

        servo.configure(servo1, 0.05, 0.12, function ()
        {
            console.log("Servo 1 Configured");
            // Get points of light and sound data.
            ambient.getSoundLevel( function(err, sdata) {
              if (err) throw err;
              console.log("Light level:", ldata.toFixed(8), " ", "Sound Level:", sdata.toFixed(8));
            });

            // Stream accelerometer data
            accel.on('data', function (xyz) {
            servo.move(servo1, sdata.toFixed(8));
          });
        });
    });
  });


  ambient.setLightTrigger(0.5);

  // Set a light level trigger
  // The trigger is a float between 0 and 1
  ambient.on('light-trigger', function(data) {
    console.log("Our light trigger was hit:", data);

    // Clear the trigger so it stops firing
    ambient.clearLightTrigger();
    //After 1.5 seconds reset light trigger
    setTimeout(function () {

        ambient.setLightTrigger(0.5);

    },1500);
  });

  // Set a sound level trigger
  // The trigger is a float between 0 and 1
  ambient.setSoundTrigger(0.1);

  ambient.on('sound-trigger', function(data) {
    console.log("Something happened with sound: ", data);

    // Clear it
    ambient.clearSoundTrigger();

    //After 1.5 seconds reset sound trigger
    setTimeout(function () {

        ambient.setSoundTrigger(0.1);

    },1500);

  });
});

ambient.on('error', function (err) {
  console.log(err)
});