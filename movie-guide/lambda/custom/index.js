require("babel-register");

const Alexa = require('alexa-sdk');
const stringSimilarity = require('string-similarity');
const CommonSenseMediaActions = require('./actions/CommonSenseMediaActions');

const SKILL_NAME = "Movie Guide";
// Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
// Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;
const NUMBER_WORDS = [
	"zero","one","two","three","four","five","six","seven","eight","nine",
	"ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen",
	"twenty","twenty-one","twenty-two","twenty-three","twenty-four","twenty-five","twenty-six","twenty-seven","twenty-eight","twenty-nine",
	"thirty","thirty-one","thirty-two","thirty-three","thirty-four","thirty-five","thirty-six","thirty-seven","thirty-eight","thirty-nine",
	"forty","forty-one","forty-two","forty-three","forty-four","forty-five","forty-six","forty-seven","forty-eight","forty-nine",
	"fifty"
];
// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

const languageStrings = {
    'en': {
        'translation': {
            'WELCOME' : "Welcome to Movie Guide!",
            'HELP'    : "Say tell me about, or describe, to hear a description the movie, or say review, or parental guidelines, to hear what parents need to know about the movie, or say user reviews, or say talking points, or say tell me if good, or say age rating, or say star rating, or say details. ",
            'ABOUT'   : "Parents can find out what content isn't only age-appropriate but also developmentally appropriate for their child. Ask Movie Guide for the review from commonsensemedia.org.",
            'STOP'    : "Okay, see you next time!"
        }
    }
    // , 'de-DE': { 'translation' : { 'TITLE'   : "Local Helfer etc." } }
};

const movieReview = {};
const alexaResponse = {
	speakMsg: '',
	cardRendererMsg: '',
};
let movieReviews = [];

// 2. Skill Code =======================================================================================================

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context);

	CommonSenseMediaActions.createTable().then(() => CommonSenseMediaActions.getReviews().then((response) => {movieReviews = movieReviews.concat(response)}));

	alexa.appId = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': () => {
        const say = this.t('WELCOME') + ' ' + this.t('HELP');
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },

    'AboutIntent':  () => {
        this.response.speak(this.t('ABOUT'));
        this.emit(':responseReady');
    },

    'CoffeeIntent':  () => {
        const restaurant = randomArrayElement(getRestaurantsByMeal('coffee'));
        this.attributes['restaurant'] = restaurant.name;

        const say = 'For a great coffee shop, I recommend, ' + restaurant.name + '. Would you like to hear more?';
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },

    'BreakfastIntent':  () => {
        const restaurant = randomArrayElement(getRestaurantsByMeal('breakfast'));
        this.attributes['restaurant'] = restaurant.name;

        const say = 'For breakfast, try this, ' + restaurant.name + '. Would you like to hear more?';
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },

    'LunchIntent':  () => {
        const restaurant = randomArrayElement(getRestaurantsByMeal('lunch'));
        this.attributes['restaurant'] = restaurant.name;

        const say = 'Lunch time! Here is a good spot. ' + restaurant.name + '. Would you like to hear more?';
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },

    'DinnerIntent':  () => {
        const restaurant = randomArrayElement(getRestaurantsByMeal('dinner'));
        this.attributes['restaurant'] = restaurant.name;

        const say = 'Enjoy dinner at, ' + restaurant.name + '. Would you like to hear more?';
        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },

    'AttractionIntent':  () => {
        const distance = 200;
        if (this.event.request.intent.slots.distance.value) {
            distance = this.event.request.intent.slots.distance.value;
        }

        const attraction = randomArrayElement(getAttractionsByDistance(distance));

        const say = 'Try '
            + attraction.name + ', which is '
            + (attraction.distance == "0" ? 'right downtown. ' : attraction.distance + ' miles away. Have fun! ')
            + attraction.description;

        this.response.speak(say);
        this.emit(':responseReady');
    },

    'GoOutIntent': function () {

        getWeather( ( localTime, currentTemp, currentCondition) => {
            // time format 10:34 PM
            // currentTemp 72
            // currentCondition, e.g.  Sunny, Breezy, Thunderstorms, Showers, Rain, Partly Cloudy, Mostly Cloudy, Mostly Sunny

            // sample API URL for Irvine, CA
            // https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22irvine%2C%20ca%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

            const say = 'It is ' + localTime
                + ' and the weather in ' + movieReview.city
                + ' is '
                + currentTemp + ' and ' + currentCondition;
            this.response.speak(say);
            this.emit(':responseReady');

            // TODO
            // Decide, based on current time and weather conditions,
            // whether to go out to a local beach or park;
            // or recommend a movie theatre; or recommend staying home


        });
    },
	'ParentIntent': function () {
		alexaResponse.speakMsg = movieReview.parentsNeedToKnow;
		alexaResponse.cardRendererMsg = 'Parental Guidelines';
        this.emit('SayResponse');
    },
	'DescribeIntent': function () {
		alexaResponse.speakMsg = movieReview.description;
		alexaResponse.cardRendererMsg = 'Movie Description';
        this.emit('SayResponse');
    },
	'AgeRatingIntent': function () {
		alexaResponse.speakMsg = movieReview.ageRating;
		alexaResponse.cardRendererMsg = 'Age Rating';
        this.emit('SayResponse');
    },
	'StarsIntent': function () {
		alexaResponse.speakMsg = movieReview.stars;
		alexaResponse.cardRendererMsg = 'Star Rating';
        this.emit('SayResponse');
    },
	'UserIntent': function () {
		alexaResponse.cardRendererMsg = 'User Reviews';
        this.emit('SayResponse');
    },
	'GoodIntent': function () {
		alexaResponse.cardRendererMsg = 'Is It Any Good';
        this.emit('SayResponse');
    },
	'PointsIntent': function () {
		alexaResponse.cardRendererMsg = 'Talking Points';
        this.emit('SayResponse');
    },
	'DetailsIntent': function () {
		alexaResponse.cardRendererMsg = 'Movie Details';
        this.emit('SayResponse');
    },
	'ReleaseIntent': function () {
		alexaResponse.cardRendererMsg = 'Release Dates';
        this.emit('SayResponse');
    },
	'DirectIntent': function () {
		alexaResponse.cardRendererMsg = 'Directors';
        this.emit('SayResponse');
    },
	'CastIntent': function () {
		alexaResponse.cardRendererMsg = 'Cast';
        this.emit('SayResponse');
    },
	'GenreIntent': function () {
		alexaResponse.cardRendererMsg = 'Genres';
        this.emit('SayResponse');
    },
	'LengthIntent': function () {
		alexaResponse.cardRendererMsg = 'Movie Length';
        this.emit('SayResponse');
    },
	'RatingIntent': function () {
		alexaResponse.cardRendererMsg = 'MPAA Rating';
        this.emit('SayResponse');
    },

    'SayResponse':  () => {
        this.response.speak(alexaResponse.speakMsg)
                     .cardRenderer(SKILL_NAME, alexaResponse.cardRendererMsg);
        this.emit(':responseReady');
    },

    'AMAZON.HelpIntent':  () => {
        this.response.speak(this.t('HELP')).listen(this.t('HELP'));
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent':  () => {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent':  () => {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':  () => {
        this.response.speak(this.t('STOP'));
        this.emit(':responseReady');
    }

};

//    END of Intent Handlers {} ========================================================================================
