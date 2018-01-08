// eslint-disable-next-line prefer-template
process.env.PATH += ':' + process.env.LAMBDA_TASK_ROOT;

const Alexa = require('alexa-sdk');
const { toWords, toWordsOrdinal } = require('number-to-words');
const stringSimilarity = require('string-similarity');

const CommonSenseMediaActions = require('./actions/CommonSenseMediaActions');
const CommonSenseMediaStore = require('./stores/CommonSenseMediaStore');

const config = require('./config');

const languageStrings = {
  'en-US': {
    translation: {
      // eslint-disable-next-line quotes, quote-props
      'WELCOME': config.welcomeText,
      // eslint-disable-next-line quotes, quote-props
      'HELP': config.helpText.join(' '),
      // eslint-disable-next-line quotes, quote-props
      'ABOUT': config.aboutText.join(' '),
      // eslint-disable-next-line quotes, quote-props
      'STOP': config.stopText
    }
  }
};

const alexaResponse = {
  speakMsg: ''
};

// eslint-disable-next-line func-names
exports.handler = function (event, context, callback) {
  // eslint-disable-next-line no-console
  console.log(`${config.skillName} Alexa Application ID: ${config.appId}`);
  const alexa = Alexa.handler(event, context);

  function successCallback() {
    return CommonSenseMediaActions.getReviews();
  }

  CommonSenseMediaActions.getUpdates(CommonSenseMediaStore.commonSenseMediaTable().scan())
    // eslint-disable-next-line func-names, prefer-arrow-callback
    .catch(function () {
      CommonSenseMediaStore.createCommonSenseMediaTable().then(successCallback);
    });

  alexa.appId = config.appId;
  alexa.resources = languageStrings;
  // eslint-disable-next-line no-use-before-define
  alexa.registerHandlers(handlers);
  alexa.execute();
  callback(null, `Alexa Application ID: ${config.appId}`);
};

// Handler Functions ===============================================================================

const handlers = {
  // eslint-disable-next-line func-names, object-shorthand
  LaunchRequest: function () {
    const say = `${this.t('WELCOME')} ${this.t('HELP')}`;
    this.response.speak(say).listen(say);
    this.emit(':responseReady');
  },

  // eslint-disable-next-line func-names, object-shorthand
  AboutIntent: function () {
    this.response.speak(this.t('ABOUT'));
    this.emit(':responseReady');
  },
  // eslint-disable-next-line func-names, object-shorthand
  ParentIntent: function () {
    const that = this;
    const movie = that.request.slot('Movie');
    // eslint-disable-next-line no-use-before-define
    getMovieReview(CommonSenseMediaStore.getState().movieReviews, movie)
      .then((movieReview) => {
        alexaResponse.speakMsg = movieReview.parentsNeedToKnow;
        that.emit('SpeakResponse');
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('getMovieReview', error);
        CommonSenseMediaActions.updateMovieReview({});
        alexaResponse.speakMsg = `${movie} not found`;
        that.emit('SpeakResponse').emit('SessionEndedRequest');
      });
  },
  // eslint-disable-next-line func-names, object-shorthand
  DescribeIntent: function () {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.description;
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  AgeRatingIntent: function () {
    const movie = this.request.slot('Movie');
    const ageRating = toWords(CommonSenseMediaStore.getState().movieReview.ageRating);
    alexaResponse.speakMsg = `${movie} has an age rating of ${ageRating}`;
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  StarsIntent: function () {
    const movie = this.request.slot('Movie');
    const stars = toWords(CommonSenseMediaStore.getState().movieReview.stars);
    alexaResponse.speakMsg = `${movie} has an star rating of ${stars}`;
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  GoodIntent: function () {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.anyGood;
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  PointsIntent: function () {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.talkingPoints.join(' ');
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  AwardsIntent: function () {
    const movie = this.request.slot('Movie');
    // eslint-disable-next-line no-use-before-define
    const awards = getResponse(CommonSenseMediaStore.getState().movieReview.product.awards);
    alexaResponse.speakMsg = awards.length === 0 ?
      `There are no awards for ${movie}` :
      `The awards for ${movie} are ${concatStrings(awards)}`; // eslint-disable-line no-use-before-define
    alexaResponse.speakMsg = awards.length > 1 ?
      alexaResponse.speakMsg :
      `The award for ${movie} is ${concatStrings(awards)}`; // eslint-disable-line no-use-before-define
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  ReleaseIntent: function () {
    const movie = this.request.slot('Movie');
    const getReleaseDates = (releaseDates = []) => {
      const last = (releaseDates.length > 1) ? (releaseDates.length - 1) : -1;
      const releases = [];
      releaseDates.forEach((releaseDate, index) => {
        if (index !== last) {
          // eslint-disable-next-line no-use-before-define
          releases.push(`to ${releaseDate.type} on ${toDateWord(releaseDate.date)}`);
        } else {
          // eslint-disable-next-line no-use-before-define
          releases.push(`and to ${releaseDate.type} on ${toDateWord(releaseDate.date)}`);
        }
      });
      return releases.join(' ');
    };
    const { releaseDates } = CommonSenseMediaStore.getState().movieReview.product;
    alexaResponse.speakMsg = `${movie} was released ${getReleaseDates(releaseDates)}`;
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  DirectIntent: function () {
    const movie = this.request.slot('Movie');
    // eslint-disable-next-line no-use-before-define
    const directors = getResponse(CommonSenseMediaStore.getState().movieReview.product.directors);
    alexaResponse.speakMsg = directors.length > 1 ?
      `The directors for ${movie} are ${concatStrings(directors)}` : // eslint-disable-line no-use-before-define
      `The director for ${movie} is ${concatStrings(directors)}`; // eslint-disable-line no-use-before-define
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  CastIntent: function () {
    const movie = this.request.slot('Movie');
    // eslint-disable-next-line no-use-before-define
    const cast = getResponse(CommonSenseMediaStore.getState().movieReview.product.cast);
    alexaResponse.speakMsg = `The main cast for ${movie} are ${concatStrings(cast)}`; // eslint-disable-line no-use-before-define
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  GenreIntent: function () {
    const movie = this.request.slot('Movie');
    // eslint-disable-next-line no-use-before-define
    const genres = getResponse(CommonSenseMediaStore.getState().movieReview.product.genres);
    alexaResponse.speakMsg = genres.length > 1 ?
      `The genres for ${movie} are ${concatStrings(genres)}` : // eslint-disable-line no-use-before-define
      `The genre for ${movie} is ${concatStrings(genres)}`; // eslint-disable-line no-use-before-define
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  LengthIntent: function () {
    const movie = this.request.slot('Movie');
    const toTimeWord = (totalMinutes) => {
      const hours = Math.floor(Math.abs(totalMinutes) / 60);
      const minutes = Math.abs(totalMinutes) % 60;
      return minutes > 0 ? `${toWords(hours)} hours and ${toWords(minutes)} minutes` :
        `${toWords(hours)} hours`;
    };

    const minutes = parseInt(CommonSenseMediaStore.getState().movieReview.product.length.value, 10);
    alexaResponse.speakMsg = minutes < 60 ? `The length of ${movie} is ${toWords(minutes)} minutes` :
      `The length of ${movie} is ${toTimeWord(minutes)}`;
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  RatingIntent: function () {
    // const toRatingWord = (rating) => {
    //   let ratingWord = '';
    //   switch(rating) {
    //     case 'NR':
    //       ratingWord = 'N.R.';
    //       break;
    //     case 'PG':
    //       ratingWord = 'P.G.';
    //       break;
    //     case 'PG-13':
    //       ratingWord = `P.G. ${toWords(13)}`;
    //       break;
    //     default:
    //       ratingWord = rating.concat('.');
    //   }
    //   return ratingWord;
    // };

    // const value = CommonSenseMediaStore.getState().movieReview.product.rating.value;
    // const explanation = CommonSenseMediaStore.getState().movieReview.product.rating.explanation;
    // alexaResponse.speakMsg = toRatingWord(value);
    // alexaResponse.speakMsg = alexaResponse.speakMsg.concat(` for ${explanation}`);
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.product.rating.text;
    this.emit('SpeakResponse');
  },
  // eslint-disable-next-line func-names, object-shorthand
  SpeakResponse: function () {
    this.response.speak(alexaResponse.speakMsg)
      .cardRenderer(config.skillName, alexaResponse.speakMsg);
    this.emit(':responseReady');
  },

  // eslint-disable-next-line func-names
  'AMAZON.HelpIntent': function () {
    this.response.speak(this.t('HELP')).listen(this.t('HELP'));
    this.emit(':responseReady');
  },
  // eslint-disable-next-line func-names
  'AMAZON.CancelIntent': function () {
    this.response.speak(this.t('STOP'));
    this.emit(':responseReady');
  },
  // eslint-disable-next-line func-names
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest');
  },
  // eslint-disable-next-line func-names, object-shorthand
  SessionEndedRequest: function () {
    this.response.speak(this.t('STOP'));
    this.emit(':responseReady');
  }

};

// Helper Functions ===============================================================================

/**
 * getResponse()
 * @param {Object[]} data
 * @returns {Object[]}
 */
function getResponse(data = []) {
  return Object.keys(data).map(key => data[key]);
}

/**
 * getMovieReview()
 * @param {Object[]} movieReviews
 * @param {string} movie
 * @returns {*}
 */
function getMovieReview(movieReviews = [], movie = '') {
  if (movieReviews.length) {
    const movieTitles = movieReviews.map(review => review.title);
    const matches = stringSimilarity.findBestMatch(movie, movieTitles);
    const findReview = review => review.title === matches.bestMatch.target;
    const movieReview = movieReviews.find(findReview);
    if (movieReview) {
      CommonSenseMediaActions.updateMovieReview(movieReview);
      return movieReview;
    }
  }
  return Promise.reject(new Error(`Movie ${movie} was not found`));
}

/**
 * toMonthWord()
 * @param {number} month - The month value 0-11.
 */
function toMonthWord(month) {
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'];

  return MONTHS[month];
}

/**
 * toDateWord()
 * @param {number} utcSeconds - Date in UTC format.
 */
function toDateWord(utcSeconds) {
  const d = new Date(0);
  const currentDate = d.setUTCSeconds(utcSeconds);

  return `${toMonthWord(currentDate.getMonth())} ${toWordsOrdinal(currentDate.toDateWord())} ${toWords(currentDate.getFullYear())}`;
}

/**
 * concatStrings()
 * @param {Object[]} data
 * @returns {string}
 */
function concatStrings(data = []) {
  const dataLength = data.length;
  let stringBuilder = [];
  if (dataLength) {
    const first = data.splice(0, (dataLength - 1));
    const last = data.splice(dataLength - 1);
    if (dataLength > 1) {
      first.push('and');
      stringBuilder = first.concat(last);
    } else {
      stringBuilder = first.splice();
    }
  }
  return stringBuilder.join(', ');
}
