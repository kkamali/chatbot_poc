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
        session.send('Hello %s, what do you want to know about Microsoft Azure?', session.userData.name);
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
    session.endDialog('Microsoft Azure is a growing collection of integrated cloud services that developers and IT professionals use to build, deploy, and manage applications through our global network of datacenters. With Azure, you get the freedom to build and deploy wherever you want, using the tools, applications, and frameworks of your choice.');
}).triggerAction({
    matches: 'azure_general'
});

bot.dialog('Tools', function (session){
    session.endDialog('Microsoft Azure lets you use the tools and open source technologies you already know and trust, like .Net, Java and PHP because Azure supports a broad selection of operating systems, programming languages, frameworks, databases, and devices.');
}).triggerAction({
    matches: 'deployment_tools'
});

bot.dialog('Developer', function (session) {
    session.endDialog('Azure developer tools allow you to easily build, debug, deploy, diagnose, and manage multi-platform, scalable apps and services. Some of these tools available for use are Visual Studio, PowerShell and the Azure Command Line Interface.');
}).triggerAction({
    matches: 'development_tools'
});

bot.dialog('Security', function (session) {
    session.endDialog('Microsoft Azure is the cloud that offers the most comprehensive compliance coverage with 50 compliance offerings. Azure has been recognized as the most trusted cloud for U.S. government institutions, including a FedRAMP High authorization that covers 18 Azure services.');
}).triggerAction({
    matches: 'security'
});

bot.dialog('Pricing', function (session) {
    session.endDialog('Azure pricing has no upfront costs, no termination fees. Only pay for what you use. Estimate your expected monthly bill using our Pricing Calculator, and track your actual account usage and bill at any time using the billing portal. Setup automatic email billing alerts to be notified if your spend goes above an amount you configure.');
}).triggerAction({
    matches: 'pricing'
});

bot.dialog('Apps', function (session) {
    session.endDialog('With Microsoft Azure you can build simple to complex projects within a consistent portal experience using deeply-integrated cloud services, so you can rapidly develop, deploy, and manage your apps. This is possible by Microsoft Azure\'s portal, Application Insights, and Operations Management Suite to which allows you to gain insights that help you quickly monitor, iterate, and manage your apps and systems.');
}).triggerAction({
    matches: 'app_development'
});

bot.dialog('Insights', function (session){
    session.endDialog('Microsoft Azure powers decisions and apps with insights. You can uncover business insights with advanced analytics and data services for both traditional and new data sources. Detect anomalies, predict behaviors, and recommend actions for your business. Engage your customers in new and interesting ways using artificial intelligence capabilities. With Cognitive Services and the Bot Framework, create the kind of app interactions that feel natural and delight users.');
}).triggerAction({
    matches: 'insights'
});

bot.dialog('Cognitive', function (session) {
    session.endDialog('Microsoft Cognitive Services enable natural and contextual interaction with tools that augment users\' experiences using the power of machine-based intelligence. Tap into an ever-growing collection of powerful artificial intelligence algorithms for vision, speech, language, and knowledge. Cognitive services include Computer Vision, Bing Speech, and Text Analytics.');
}).triggerAction({
    matches: 'cognitive_services'
});

bot.dialog('Cloud', function (session) {
    session.endDialog('Simply put, cloud computing is the delivery of computing services—servers, storage, databases, networking, software, analytics, and more—over the Internet (“the cloud”). Companies offering these computing services are called cloud providers and typically charge for cloud computing services based on usage, similar to how you’re billed for water or electricity at home.');
}).triggerAction({
    matches: 'cloud'
});

server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));
