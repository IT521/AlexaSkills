import alt from '../alt';

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
   * getReviews()
   */
  getReviews() {
    return (dispatch) => {
      dispatch();
      CommonSenseMediaFetcher.fetchMovieReviews()
        .then(response => !!response.length && this.updateMovieReviews(response));
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
        .then(response => !!response.length && this.updateMovieReviews(response));
    };
  }
}

export default alt.createActions(CommonSenseMediaActions);
