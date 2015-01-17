var tessel = require('tessel');
var servolib = require('servo-pca9685');

var accel = require('accel-mma84').use(tessel.port['A']);
var rolling = [];
var sum = 0;

// Initialize the accelerometer.
accel.on('ready', function () {
    console.log("accelerometer ready");
    var servo = servolib.use(tessel.port['B']);
    var servo0 = 1;
    var servo1 = 2;


    servo.on('ready', function () {
        console.log("Servo Ready");

        accel.setOutputRate(100, function() {
	        console.log("set output rate");

	        servo.configure(servo1, 0.05, 0.12, function ()
	        {
	            console.log("Servo 1 Configured");
	    		
	    		// Stream accelerometer data
	            accel.on('data', function (xyz) {
					servo.move(servo1, xyz[1]);
		        });
	        });

	        servo.configure(servo0, 0.05, 0.12, function ()
	        {
	            console.log("Servo 0 Configured");
	    		
	    		// Stream accelerometer data
	            accel.on('data', function (xyz) {		            
			        console.log(
			        	'x:', xyz[0].toFixed(2),
						'y:', xyz[1].toFixed(2),
						'z:', xyz[2].toFixed(2)
					);

					servo.move(servo0, xyz[2]);
					servo.move(servo1, xyz[1]);
		        });
	        });
	    });
    });
});

accel.on('error', function(err){
  console.log('Error:', err);
});