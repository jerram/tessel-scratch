// Send a text message upon trigger light of sound

var tessel = require('tessel');
var gprslib = require('gprs-sim900');
var ambientlib = require('ambient-attx4');

var hardware = tessel.port['A'];
var ambient = ambientlib.use(tessel.port['D']);
var gprs = gprslib.use(hardware);

var phoneNumber = '+61452531124'; // Replace the #s with the String representation of the phone number, including country code (1 for USA)
var message = 'TesselWatch is online....';
var enabled = false;

ambient.setLightTrigger(0.5);
ambient.setSoundTrigger(0.3);

gprs.on('ready', function() {
    console.log('GPRS module connected to Tessel. Searching for network...')    
        //  Give it 10 more seconds to connect to the network, then try to send an SMS
    setTimeout(sendSMS(message + ' ' + new Date()), 10000);
    enabled = true;
});

function sendSMS(text) {
    console.log('Sending SMS...');
    gprs.sendSMS(phoneNumber, text, function smsCallback(err, data) {
        if (err) {
            return console.log(err);
        }
        var success = data[0] !== -1;
        console.log('data:', data);
        console.log('Text sent:', success);
        if (success) {
            // If successful, log the number of the sent text
            console.log('GPRS Module sent text #', data[0]);
        }
    });
}

ambient.on('ready', function() {
    console.log('Ambient ready...');

    // // Get points of light and sound data.
    // setInterval(function() {
    //     ambient.getLightLevel(function(err, ldata) {
    //         if (err) throw err;
    //         ambient.getSoundLevel(function(err, sdata) {
    //             if (err) throw err;
    //             console.log("Light level:", ldata.toFixed(8), " ", "Sound Level:", sdata.toFixed(8));
    //         });
    //     })
    // }, 500); // The readings will happen every .5 seconds unless the trigger is hit

    ambient.on('light-trigger', function(data) {
        
        console.log("Our light trigger was hit: " + data);
        
        if(enabled){
            sendSMS("Our light trigger was hit: " + data)    
        }
        
        // Clear the trigger so it stops firing
        ambient.clearLightTrigger();
        
        //After 1.5 seconds reset light trigger
        setTimeout(function() {
            ambient.setLightTrigger(0.5);
        }, 1500);
    
    });

    // Set a sound level trigger
    // The trigger is a float between 0 and 1
    ambient.on('sound-trigger', function(data) {
        
        console.log("Something happened with sound: " + data);
        
        if(enabled){
            sendSMS("Something happened with sound: " + data)
        }
        // Clear it
        ambient.clearSoundTrigger();
        
        //After 1.5 seconds reset sound trigger
        setTimeout(function() {
            ambient.setSoundTrigger(0.3);
        }, 1500);
    
    });
});


//  Handle errors
gprs.on('error', function(err) {
    console.log('Got an error of some kind:\n', err);
});

ambient.on('error', function(err) {
    console.log(err)
});
