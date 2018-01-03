import alt from '../utilities/alt';

// Fetcher
import CommonSenseMediaFetcher from '../fetchers/CommonSenseMediaFetcher';

/*
 * Helper Functions
 */

function getLatestTimestamp(movieReviews = []) {
  const timestamps = movieReviews.map(movieReview => movieReview.updated);
  return Math.max(...timestamps);
}

class CommonSenseMediaActions {
  constructor() {
    this.generateActions('UPDATE_MOVIE_REVIEW', 'UPDATE_MOVIE_REVIEWS');
  }

  /**
   * updateTable()
   * @param reviewsTable
   * @returns {boolean}
   */
  static updateTable(reviewsTable = {}) {
    if (reviewsTable) {
      // TODO: convert reviewsTable to array of objects
      this.getUpdates(reviewsTable);
      return true;
    }
    return false;
  }

  /**
   * getReviews()
   */
  getReviews() {
    return (dispatch) => {
      dispatch();
      CommonSenseMediaFetcher.fetchMovieReviews()
        .then(response => !!response.length && this.updateMovieReviews(response))
        .catch(error => console.log('getReviews', error));
    };
  }
  /**
   * getUpdates()
   */
  getUpdates(movieReviews = []) {
    return (dispatch) => {
      const timestamp = getLatestTimestamp(movieReviews);
      dispatch();
      CommonSenseMediaFetcher.fetchUpdates(timestamp)
        .then(response => !!response.length && this.updateMovieReviews(response))
        .catch(error => console.log('getUpdates', error));
    };
  }
}

export default alt.createActions(CommonSenseMediaActions);
