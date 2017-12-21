require('babel-register');

const Alexa = require('alexa-sdk');
const commonSenseMediaActions = require('./actions/commonSenseMediaActions');
const handlers = require('./handlers');
const config = require('./config');

const helpText = ['Say tell me about, or describe, to hear a description the movie,',
  'or say review, or parental guidelines, to hear what parents need to know about the movie,',
  'or say user reviews, or say talking points, or say tell me if good, or say age rating,',
  'or say star rating, or say details.'];
const aboutText = ['Parents can find out what content is not only age-appropriate',
  'but also developmentally appropriate for their child.',
  `Ask ${config.skillName} for the review from commonsensemedia.org.`];
const languageStrings = {
  en: {
    translation: {
      WELCOME: `Welcome to ${config.skillName}!`,
      HELP: helpText.join(' '),
      ABOUT: aboutText.join(' '),
      STOP: 'Okay, see you next time!'
    }
  }
};

let movieReviews = [];

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);

  commonSenseMediaActions.createTable()
    .then(() => commonSenseMediaActions.getReviews()
      .then((response) => {
        movieReviews = movieReviews.concat(response);
      }));

  alexa.appId = config.appId;
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
