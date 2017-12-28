import { toWords, toWordsOrdinal } from 'number-to-words';
import stringSimilarity from 'string-similarity';

import config from './config';
import logger from './utilities/logger';

import CommonSenseMediaActions from './actions/CommonSenseMediaActions';
import CommonSenseMediaStore from './stores/CommonSenseMediaStore';

const alexaResponse = {
  speakMsg: ''
};

// Helper Functions ===============================================================================

function getResponse(data = []) {
  return Object.keys(data).map(key => data[key]);
}

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

// Handler Functions ===============================================================================

const handlers = {
  LaunchRequest: () => {
    const say = `${this.t('WELCOME')} ${this.t('HELP')}`;
    this.response.speak(say).listen(say);
    this.emit(':responseReady');
  },

  AboutIntent: () => {
    this.response.speak(this.t('ABOUT'));
    this.emit(':responseReady');
  },
  ParentIntent: () => {
    const that = this;
    const movie = that.request.slot('Movie');
    getMovieReview(CommonSenseMediaStore.getState().movieReviews, movie)
      .then((movieReview) => {
        alexaResponse.speakMsg = movieReview.parentsNeedToKnow;
        that.emit('SpeakResponse');
      })
      .catch((error) => {
        logger.error(error);
        CommonSenseMediaActions.updateMovieReview({});
        alexaResponse.speakMsg = `${movie} not found`;
        that.emit('SpeakResponse').emit('SessionEndedRequest');
      });
  },
  DescribeIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.description;
    this.emit('SpeakResponse');
  },
  AgeRatingIntent: () => {
    const movie = this.request.slot('Movie');
    const ageRating = toWords(CommonSenseMediaStore.getState().movieReview.ageRating);
    alexaResponse.speakMsg = `${movie} has an age rating of ${ageRating}`;
    this.emit('SpeakResponse');
  },
  StarsIntent: () => {
    const movie = this.request.slot('Movie');
    const stars = toWords(CommonSenseMediaStore.getState().movieReview.stars);
    alexaResponse.speakMsg = `${movie} has an star rating of ${stars}`;
    this.emit('SpeakResponse');
  },
  GoodIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.anyGood;
    this.emit('SpeakResponse');
  },
  PointsIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.talkingPoints.join(' ');
    this.emit('SpeakResponse');
  },
  AwardsIntent: () => {
    const movie = this.request.slot('Movie');
    const awards = getResponse(CommonSenseMediaStore.getState().movieReview.product.awards);
    alexaResponse.speakMsg = awards.length === 0 ?
      `There are no awards for ${movie}` :
      `The awards for ${movie} are ${concatStrings(awards)}`;
    alexaResponse.speakMsg = awards.length > 1 ?
      alexaResponse.speakMsg :
      `The award for ${movie} is ${concatStrings(awards)}`;
    this.emit('SpeakResponse');
  },
  ReleaseIntent: () => {
    const movie = this.request.slot('Movie');
    const getReleaseDates = (releaseDates = []) => {
      const last = (releaseDates.length > 1) ? (releaseDates.length - 1) : -1;
      const releases = [];
      releaseDates.forEach((releaseDate, index) => {
        if (index !== last) {
          releases.push(`to ${releaseDate.type} on ${toDateWord(releaseDate.date)}`);
        } else {
          releases.push(`and to ${releaseDate.type} on ${toDateWord(releaseDate.date)}`);
        }
      });
      return releases.join(' ');
    };
    const { releaseDates } = CommonSenseMediaStore.getState().movieReview.product;
    alexaResponse.speakMsg = `${movie} was released ${getReleaseDates(releaseDates)}`;
    this.emit('SpeakResponse');
  },
  DirectIntent: () => {
    const movie = this.request.slot('Movie');
    const directors = getResponse(CommonSenseMediaStore.getState().movieReview.product.directors);
    alexaResponse.speakMsg = directors.length > 1 ?
      `The directors for ${movie} are ${concatStrings(directors)}` :
      `The director for ${movie} is ${concatStrings(directors)}`;
    this.emit('SpeakResponse');
  },
  CastIntent: () => {
    const movie = this.request.slot('Movie');
    const cast = getResponse(CommonSenseMediaStore.getState().movieReview.product.cast);
    alexaResponse.speakMsg = `The main cast for ${movie} are ${concatStrings(cast)}`;
    this.emit('SpeakResponse');
  },
  GenreIntent: () => {
    const movie = this.request.slot('Movie');
    const genres = getResponse(CommonSenseMediaStore.getState().movieReview.product.genres);
    alexaResponse.speakMsg = genres.length > 1 ?
      `The genres for ${movie} are ${concatStrings(genres)}` :
      `The genre for ${movie} is ${concatStrings(genres)}`;
    this.emit('SpeakResponse');
  },
  LengthIntent: () => {
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
  RatingIntent: () => {
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
  SpeakResponse: () => {
    this.response.speak(alexaResponse.speakMsg)
      .cardRenderer(config.skillName, alexaResponse.speakMsg);
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
  SessionEndedRequest: () => {
    this.response.speak(this.t('STOP'));
    this.emit(':responseReady');
  }

};

export default handlers;
