const alt = require('../altLib');

// Fetcher
const CommonSenseMediaFetcher = require('../fetchers/CommonSenseMediaFetcher');

/*
 * Helper Functions
 */
function getTimestamp(movieReview) {
  return movieReview.updated;
}

function getLatestTimestamp(movieReviews = []) {
  const timestamps = movieReviews.map(getTimestamp);
  return Math.max(...timestamps);
}

class CommonSenseMediaActions {
  constructor() {
    this.generateActions('updateMovieReview', 'updateMovieReviews');
  }
  /**
   * getReviews()
   */
  // eslint-disable-next-line func-names, object-shorthand
  getReviews() {
    const that = this;
    // eslint-disable-next-line func-names
    return function (dispatch) {
      dispatch();
      return CommonSenseMediaFetcher.fetchMovieReviews()
      // eslint-disable-next-line func-names, prefer-arrow-callback
        .then(function (response) {
          if (response.length) {
            that.updateMovieReviews(response);
          }
        })
        // eslint-disable-next-line func-names, prefer-arrow-callback
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.log('getReviews', error);
        });
    };
  }
  /**
   * getUpdates()
   */
  // eslint-disable-next-line func-names, object-shorthand
  getUpdates(movieReviews = []) {
    const that = this;
    // eslint-disable-next-line func-names
    return function (dispatch) {
      const timestamp = getLatestTimestamp(movieReviews);
      dispatch();
      return CommonSenseMediaFetcher.fetchUpdates(timestamp)
        // eslint-disable-next-line func-names, prefer-arrow-callback
        .then(function (response) {
          if (response.length) {
            that.updateMovieReviews(response);
          }
        })
        // eslint-disable-next-line func-names, prefer-arrow-callback
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.log('getUpdates', error);
        });
    };
  }
}

const commonSenseMediaActions = alt.createActions(CommonSenseMediaActions);
module.exports = commonSenseMediaActions;
