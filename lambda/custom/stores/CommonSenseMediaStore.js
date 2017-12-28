import dynasty from 'dynasty';

import alt from '../alt';
import logger from '../utilities/logger';
import config from '../config';

import CommonSenseMediaActions from '../actions/CommonSenseMediaActions';

class CommonSenseMediaStore {
  constructor() {
    this.movieReview = {};
    this.movieReviews = [];

    this.bindListeners({
      handleUpdateMovieReview: CommonSenseMediaActions.UPDATE_MOVIE_REVIEW,
      handleUpdateMovieReviews: CommonSenseMediaActions.UPDATE_MOVIE_REVIEWS
    });

    dynasty(config.credentials);
  }

  /**
   * commonSenseMediaTable()
   */
  static commonSenseMediaTable() {
    return dynasty.table(config.commonSenseMediaDataTable);
  }
  /**
   * createCommonSenseMediaTable()
   */
  static createCommonSenseMediaTable() {
    dynasty.describe(config.commonSenseMediaDataTable)
      .catch((error) => {
        logger.error('createCommonSenseMediaTable: describe:', error);
        return dynasty.create(config.commonSenseMediaDataTable, {
          key_schema: {
            hash: ['uuid', 'string']
          }
        });
      });
  }
  /**
   * storeCommonSenseMediaData()
   */
  static storeCommonSenseMediaData(commonSenseMediaData = []) {
    const that = this;
    if (commonSenseMediaData.length) {
      commonSenseMediaData.forEach((data) => {
        logger.info(`writing commonSenseMediaData to database for universal unique identifier of ${data.uuid}`);
        that.commonSenseMediaTable().insert({
          uuid: data.uuid,
          data
        }).catch(error => logger.error(error));
      });
    }
  }
  /**
   * readCommonSenseMediaData()
   */
  static readCommonSenseMediaData(uuid) {
    logger.info(`reading commonSenseMediaData with universal unique identifier of ${uuid}`);
    return this.commonSenseMediaTable().find(uuid)
      .then(result => result).catch(error => logger.error(error));
  }

  /**
   * handleUpdateMovieReview()
   */
  handleUpdateMovieReview(movieReview = {}) {
    this.movieReview = movieReview;
  }
  /**
   * handleUpdateMovieReviews()
   */
  handleUpdateMovieReviews(movieReviews = []) {
    this.movieReviews = movieReviews;
    this.storeCommonSenseMediaData(movieReviews);
  }
}

export default alt.createStore(CommonSenseMediaStore, 'CommonSenseMediaStore');
