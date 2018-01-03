import dynasty from 'dynasty';
import alt from '../utilities/alt';
import CommonSenseMediaActions from '../actions/CommonSenseMediaActions';

import config from '../config';

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
    console.log('createCommonSenseMediaTable');
    return dynasty.describe(config.commonSenseMediaDataTable)
      .catch((error) => {
        console.log('createCommonSenseMediaTable: describe:', error);
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
        console.log(`writing commonSenseMediaData to database for universal unique identifier of ${data.uuid}`);
        return that.commonSenseMediaTable().insert({
          uuid: data.uuid,
          data
        }).catch(error => console.log('storeCommonSenseMediaData', error));
      });
    }
  }
  /**
   * readCommonSenseMediaData()
   */
  static readCommonSenseMediaData(uuid) {
    console.log(`reading commonSenseMediaData with universal unique identifier of ${uuid}`);
    return this.commonSenseMediaTable().find(uuid)
      .then(result => result).catch(error => console.log('readCommonSenseMediaData', error));
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
