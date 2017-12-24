// import { toWords, toWordsOrdinal } from 'number-to-words';

// import stringSimilarity from 'string-similarity';

// import genericGetJSON from './utilities/genericGetJSON';
import config from './config';

const movieReview = {};
const alexaResponse = {
  speakMsg: '',
  cardRendererMsg: ''
};

// Helper Functions ===============================================================================

function getResponse(data = []) {
  return Object.keys(data).map(key => data[key]).join();
}

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
    alexaResponse.speakMsg = movieReview.parentsNeedToKnow;
    alexaResponse.cardRendererMsg = 'Parental Guidelines';
    this.emit('SpeakResponse');
  },
  DescribeIntent: () => {
    alexaResponse.speakMsg = movieReview.description;
    alexaResponse.cardRendererMsg = 'Movie Description';
    this.emit('SpeakResponse');
  },
  AgeRatingIntent: () => {
    alexaResponse.speakMsg = movieReview.ageRating;
    alexaResponse.cardRendererMsg = 'Age Rating';
    this.emit('SpeakResponse');
  },
  StarsIntent: () => {
    alexaResponse.speakMsg = movieReview.stars;
    alexaResponse.cardRendererMsg = 'Star Rating';
    this.emit('SpeakResponse');
  },
  GoodIntent: () => {
    alexaResponse.speakMsg = movieReview.anyGood;
    alexaResponse.cardRendererMsg = 'Is It Any Good';
    this.emit('SpeakResponse');
  },
  PointsIntent: () => {
    alexaResponse.speakMsg = movieReview.talkingPoints;
    alexaResponse.cardRendererMsg = 'Talking Points';
    this.emit('SpeakResponse');
  },
  AwardsIntent: () => {
    alexaResponse.speakMsg = getResponse(movieReview.product.awards);
    alexaResponse.cardRendererMsg = 'Movie Details';
    this.emit('SpeakResponse');
  },
  ReleaseIntent: () => {
    alexaResponse.speakMsg = movieReview.TBD;
    alexaResponse.cardRendererMsg = 'Release Dates';
    this.emit('SpeakResponse');
  },
  DirectIntent: () => {
    alexaResponse.speakMsg = movieReview.TBD;
    alexaResponse.cardRendererMsg = 'Directors';
    this.emit('SpeakResponse');
  },
  CastIntent: () => {
    alexaResponse.speakMsg = movieReview.TBD;
    alexaResponse.cardRendererMsg = 'Cast';
    this.emit('SpeakResponse');
  },
  GenreIntent: () => {
    alexaResponse.speakMsg = movieReview.TBD;
    alexaResponse.cardRendererMsg = 'Genres';
    this.emit('SpeakResponse');
  },
  LengthIntent: () => {
    alexaResponse.speakMsg = movieReview.TBD;
    alexaResponse.cardRendererMsg = 'Movie Length';
    this.emit('SpeakResponse');
  },
  RatingIntent: () => {
    alexaResponse.speakMsg = movieReview.TBD;
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
