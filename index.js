const open = require('open');
const promptly = require('promptly');
const twilio = require('twilio');


const {checkForPlaystationDirectRedirect} = require("./utils");

/** Constants */
let numTries = 1;
const playstationType = {
    "disc": {
        "id": 3005816,
        "url": "https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816",
    },
    "digital": {
        "id": 3005817,
        "url": "https://direct.playstation.com/en-us/consoles/console/playstation5-digital-edition-console.3005817",
    }
};

/** Let's do this */
(async function() {
    const choice = await promptly.choose("Which version would you like? (disc or digital)", ["disc", "digital"]);
    console.log(`Searching for PlayStation 5 ${choice} edition...`);

    var smsNotifications = false;
    console.log("Twilio information required - please enter phone numbers in international format");
    console.log("E.g. +49123456789");
    const twilioNumber = await promptly.prompt("Twilio Phone Number: ");
    const accountSid = await promptly.prompt("Twilio Account SID: ");
    const authToken = await promptly.prompt("Twilio Auth Token: ");
    const phoneNumber = await promptly.prompt("Your phone number: ");
    var client = new twilio(accountSid, authToken);
    
    client.messages.create({
        body: 'Get-My-PS5 has been configured properly and is now running',
        to: phoneNumber,  
        from: twilioNumber 
    })
    .then((message) => console.log('Twilio message ID: ', message.sid));
    
    const onSuccess = () => {
        console.log("Found it! Opening queue now...");
        client.messages.create({
            body: 'PS5 found!! Run to your computer to complete checkout!',
            to: phoneNumber,  
            from: twilioNumber 
        })
        .then((message) => console.log('Twilio message ID: ', message.sid));
        open(playstationType[choice].url);
    };

    checkForPlaystationDirectRedirect(5000, onSuccess);
})();
