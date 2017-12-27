import { toWords } from 'number-to-words';
import stringSimilarity from 'string-similarity';
import config from './config';

import CommonSenseMediaActions from './actions/CommonSenseMediaActions';
import CommonSenseMediaStore from './stores/CommonSenseMediaStore';

const alexaResponse = {
  speakMsg: '',
  cardRendererMsg: ''
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
  return Promise.reject(new Error('movie not found'));
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
      .then(() => {
        alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.parentsNeedToKnow;
        alexaResponse.cardRendererMsg = 'Review';
        that.emit('SpeakResponse');
      })
      .catch(() => {
        alexaResponse.speakMsg = `${movie} not found`;
        alexaResponse.cardRendererMsg = 'No Review';
        that.emit('SpeakResponse');
        // TODO: End session somehow.
      });
  },
  DescribeIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.description;
    alexaResponse.cardRendererMsg = 'Movie Description';
    this.emit('SpeakResponse');
  },
  AgeRatingIntent: () => {
    const movie = this.request.slot('Movie');
    alexaResponse.speakMsg = `${movie} has an age rating of ${toWords(CommonSenseMediaStore.getState().movieReview.ageRating)}`;
    alexaResponse.cardRendererMsg = 'Age Rating';
    this.emit('SpeakResponse');
  },
  StarsIntent: () => {
    const movie = this.request.slot('Movie');
    alexaResponse.speakMsg = `${movie} has an star rating of ${toWords(CommonSenseMediaStore.getState().movieReview.stars)}`;
    alexaResponse.cardRendererMsg = 'Star Rating';
    this.emit('SpeakResponse');
  },
  GoodIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.anyGood;
    alexaResponse.cardRendererMsg = 'Is It Any Good?';
    this.emit('SpeakResponse');
  },
  PointsIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.talkingPoints.join(' ');
    alexaResponse.cardRendererMsg = 'Talk to your kids about...';
    this.emit('SpeakResponse');
  },
  AwardsIntent: () => {
    const movie = this.request.slot('Movie');
    const getAwards = (awards = []) => {
      let consolidateAwards = [];
      if (awards.length) {
        const first = awards.splice(0, (awards.length - 1));
        const last = awards.splice(awards.length - 1);
        if (awards.length > 1) {
          first.push('and');
          consolidateAwards = first.concat(last);
        } else {
          consolidateAwards = first.splice();
        }
      }
      return consolidateAwards.join(', ');
    };
    alexaResponse.speakMsg = `The awards for ${movie} are ${getAwards(getResponse(CommonSenseMediaStore.getState().movieReview.product.awards))}`;
    alexaResponse.cardRendererMsg = 'Movie Details';
    this.emit('SpeakResponse');
  },
  ReleaseIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.TBD;
    alexaResponse.cardRendererMsg = 'Release Dates';
    this.emit('SpeakResponse');
  },
  DirectIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.TBD;
    alexaResponse.cardRendererMsg = 'Directors';
    this.emit('SpeakResponse');
  },
  CastIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.TBD;
    alexaResponse.cardRendererMsg = 'Cast';
    this.emit('SpeakResponse');
  },
  GenreIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.TBD;
    alexaResponse.cardRendererMsg = 'Genres';
    this.emit('SpeakResponse');
  },
  LengthIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.TBD;
    alexaResponse.cardRendererMsg = 'Movie Length';
    this.emit('SpeakResponse');
  },
  RatingIntent: () => {
    alexaResponse.speakMsg = CommonSenseMediaStore.getState().movieReview.TBD;
    alexaResponse.cardRendererMsg = 'MPAA Rating';
    this.emit('SpeakResponse');
  },
  SpeakResponse: () => {
    this.response.speak(alexaResponse.speakMsg)
      .cardRenderer(config.skillName, alexaResponse.cardRendererMsg);
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
