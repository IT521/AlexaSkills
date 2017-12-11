'use strict';
require('babel-register');
const Alexa = require("alexa-sdk");

// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build

// Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
// Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Movie Guide';
const MOVIE_GUIDE_MESSAGE = "Welcome to Movie Guide!";
const HELP_MESSAGE = 'You can say tell me about it, or, describe it, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

let cardRendererMsg = '';

exports.handler = function(event, context) {
    const alexa = Alexa.handler(event, context);
	alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
		cardRendererMsg = '';
        this.emit('SayHello');
    },
	'MovieGuide.ParentIntent': function () {
		cardRendererMsg = 'Parental Guidelines';
        this.emit('SayHello');
    },
	'MovieGuide.DescribeIntent': function () {
		cardRendererMsg = 'Movie Description';
        this.emit('SayHello');
    },
	'MovieGuide.AgeRatingIntent': function () {
		cardRendererMsg = 'Age Rating';
        this.emit('SayHello');
    },
	'MovieGuide.StarRatingIntent': function () {
		cardRendererMsg = 'Star Rating';
        this.emit('SayHello');
    },
	'MovieGuide.UserIntent': function () {
		cardRendererMsg = 'User Reviews';
        this.emit('SayHello');
    },
	'MovieGuide.GoodIntent': function () {
		cardRendererMsg = 'Is It Any Good';
        this.emit('SayHello');
    },
	'MovieGuide.PointsIntent': function () {
		cardRendererMsg = 'Talking Points';
        this.emit('SayHello');
    },
	'MovieGuide.DetailsIntent': function () {
		cardRendererMsg = 'Movie Details';
        this.emit('SayHello');
    },
	'MovieGuide.ReleaseIntent': function () {
		cardRendererMsg = 'Release Dates';
        this.emit('SayHello');
    },
	'MovieGuide.DirectIntent': function () {
		cardRendererMsg = 'Directors';
        this.emit('SayHello');
    },
	'MovieGuide.CastIntent': function () {
		cardRendererMsg = 'Cast';
        this.emit('SayHello');
    },
	'MovieGuide.GenreIntent': function () {
		cardRendererMsg = 'Genres';
        this.emit('SayHello');
    },
	'MovieGuide.LengthIntent': function () {
		cardRendererMsg = 'Movie Length';
        this.emit('SayHello');
    },
	'MovieGuide.RatingIntent': function () {
		cardRendererMsg = 'MPAA Rating';
        this.emit('SayHello');
    },
    'SayHello': function () {
        this.response.speak(MOVIE_GUIDE_MESSAGE)
                     .cardRenderer(SKILL_NAME, cardRendererMsg);
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        const speechOutput = HELP_MESSAGE;
        this.response.speak(`Sorry, I didn't get that. ${speechOutput}`);
    }
};
