require("babel-register");

const Alexa = require('alexa-sdk');
const stringSimilarity = require('string-similarity');
const CommonSenseMediaActions = require('./actions/CommonSenseMediaActions');

const SKILL_NAME = "Movie Guide";
// Replace with your app ID (OPTIONAL). You can find this value at the top of your skill's page on http://developer.amazon.com.
// Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;
const NUMBER_WORDS = [
	"zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
	"ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
	"twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine",
	"thirty", "thirty-one", "thirty-two", "thirty-three", "thirty-four", "thirty-five", "thirty-six", "thirty-seven", "thirty-eight", "thirty-nine",
	"forty", "forty-one", "forty-two", "forty-three", "forty-four", "forty-five", "forty-six", "forty-seven", "forty-eight", "forty-nine",
	"fifty"
];
// 1. Text strings =====================================================================================================
// Modify these strings and messages to change the behavior of your Lambda function

const languageStrings = {
	'en': {
		'translation': {
			'WELCOME': "Welcome to Movie Guide!",
			'HELP': "Say tell me about, or describe, to hear a description the movie, or say review, or parental guidelines, to hear what parents need to know about the movie, or say user reviews, or say talking points, or say tell me if good, or say age rating, or say star rating, or say details. ",
			'ABOUT': "Parents can find out what content isn't only age-appropriate but also developmentally appropriate for their child. Ask Movie Guide for the review from commonsensemedia.org.",
			'STOP': "Okay, see you next time!"
		}
	}
	// , 'de-DE': { 'translation' : { 'TITLE' : "Local Helfer etc." } }
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

	CommonSenseMediaActions.createTable().then(() => CommonSenseMediaActions.getReviews().then((response) => {
			movieReviews = movieReviews.concat(response)
		}));

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

	'AboutIntent': () => {
		this.response.speak(this.t('ABOUT'));
		this.emit(':responseReady');
	},
	'ParentIntent': () => {
		alexaResponse.speakMsg = movieReview.parentsNeedToKnow;
		alexaResponse.cardRendererMsg = 'Parental Guidelines';
		this.emit('SpeakResponse');
	},
	'DescribeIntent': () => {
		alexaResponse.speakMsg = movieReview.description;
		alexaResponse.cardRendererMsg = 'Movie Description';
		this.emit('SpeakResponse');
	},
	'AgeRatingIntent': () => {
		alexaResponse.speakMsg = movieReview.ageRating;
		alexaResponse.cardRendererMsg = 'Age Rating';
		this.emit('SpeakResponse');
	},
	'StarsIntent': () => {
		alexaResponse.speakMsg = movieReview.stars;
		alexaResponse.cardRendererMsg = 'Star Rating';
		this.emit('SpeakResponse');
	},
	'GoodIntent': () => {
		alexaResponse.speakMsg = movieReview.anyGood;
		alexaResponse.cardRendererMsg = 'Is It Any Good';
		this.emit('SpeakResponse');
	},
	'PointsIntent': () => {
		alexaResponse.speakMsg = movieReview.talkingPoints;
		alexaResponse.cardRendererMsg = 'Talking Points';
		this.emit('SpeakResponse');
	},
	// TODO: Rename DetailsIntent to AwardsIntent
	'DetailsIntent': () => {
		alexaResponse.speakMsg = getResponse(movieReview.product.awards);
		alexaResponse.cardRendererMsg = 'Movie Details';
		this.emit('SpeakResponse');
	},
	'ReleaseIntent': () => {
		alexaResponse.speakMsg = movieReview.TBD;
		alexaResponse.cardRendererMsg = 'Release Dates';
		this.emit('SpeakResponse');
	},
	'DirectIntent': () => {
		alexaResponse.speakMsg = movieReview.TBD;
		alexaResponse.cardRendererMsg = 'Directors';
		this.emit('SpeakResponse');
	},
	'CastIntent': () => {
		alexaResponse.speakMsg = movieReview.TBD;
		alexaResponse.cardRendererMsg = 'Cast';
		this.emit('SpeakResponse');
	},
	'GenreIntent': () => {
		alexaResponse.speakMsg = movieReview.TBD;
		alexaResponse.cardRendererMsg = 'Genres';
		this.emit('SpeakResponse');
	},
	'LengthIntent': () => {
		alexaResponse.speakMsg = movieReview.TBD;
		alexaResponse.cardRendererMsg = 'Movie Length';
		this.emit('SpeakResponse');
	},
	'RatingIntent': () => {
		alexaResponse.speakMsg = movieReview.TBD;
		alexaResponse.cardRendererMsg = 'MPAA Rating';
		this.emit('SpeakResponse');
	},
	'SpeakResponse': () => {
		this.response.speak(alexaResponse.speakMsg)
		.cardRenderer(SKILL_NAME, alexaResponse.cardRendererMsg);
		this.emit(':responseReady');
	},

	'AMAZON.HelpIntent': () => {
		this.response.speak(this.t('HELP')).listen(this.t('HELP'));
		this.emit(':responseReady');
	},
	'AMAZON.CancelIntent': () => {
		this.response.speak(this.t('STOP'));
		this.emit(':responseReady');
	},
	'AMAZON.StopIntent': () => {
		this.emit('SessionEndedRequest');
	},
	'SessionEndedRequest': () => {
		this.response.speak(this.t('STOP'));
		this.emit(':responseReady');
	}

};

// Helper Functions ========================================================================================

function getResponse(data = []) {
	return Object.keys(data).map(key => data[key]).join();
}