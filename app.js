// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('/', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s, what do you want to know?', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi, welcome to Microsoft Azure! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('Help', function (session) {
    session.endDialog('Hi! Let me know how I can help! You can ask things like "I need general information" or "Tell me about Azure security."');
}).triggerAction({
    matches: 'help'
});

bot.dialog('General', function (session) {
    session.endDialog('Microsoft Azure is a cloud computing service created by Microsoft for building, deploying, and managing applications and services through a global network of Microsoft-managed data centers. It provides software as a service, platform as a service and infrastructure as a service and supports many different programming languages, tools and frameworks, including both Microsoft-specific and third-party software and systems.');
}).triggerAction({
    matches: 'azure_general'
});

bot.dialog('Tools', function (session){
    session.endDialog('You can use a lot of tools to build applications to deploy on Azure - such as Java, Node, PHP, etc. There are also Linux virtual machines to use other open source tools. Azure also has developer tools available for use.');
}).triggerAction({
    matches: 'deployment_tools'
});

bot.dialog('Developer', function (session) {
    session.endDialog('The developer tools available for use are Visual Studio, PowerShell and the Azure Command Line Interface.');
}).triggerAction({
    matches: 'development_tools'
});

bot.dialog('Security', function (session) {
    session.endDialog('The cloud that offers the most comprehensive compliance coverage with 50 compliance offerings. Azure has been recognized as the most trusted cloud for U.S. government institutions, including a FedRAMP High authorization that covers 18 Azure services.');
}).triggerAction({
    matches: 'security'
});
