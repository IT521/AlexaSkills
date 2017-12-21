// Fetcher
import commonSenseMediaFetcher from '../fetchers/commonSenseMediaFetcher';

// Reducer
import commonSenseMediaReducer from '../reducers/commonSenseMediaReducer';

/*
 * Helper Functions
 */

function getLatestTimestamp(movieReviews = []) {
  const timestamps = movieReviews.map(movieReview => movieReview.updated);
  return Math.max(...timestamps);
}

const commonSenseMediaActions = {
  /**
   * createTable()
   */
  createTable: () => commonSenseMediaReducer.createCommonSenseMediaTable(),
  /**
   * updateReviews()
   */
  updateReviews: (movieReviews = null) =>
    commonSenseMediaReducer.storeCommonSenseMediaData(movieReviews),
  /**
   * getReviews()
   */
  getReviews: () => commonSenseMediaFetcher.fetchMovieReviews()
    .then((response) => {
      this.updateReviews(response).then(() => response);
    }),
  /**
   * getUpdates()
   */
  getUpdates: (movieReviews = []) => {
    const timestamp = getLatestTimestamp(movieReviews);
    return commonSenseMediaFetcher.fetchUpdates(timestamp)
      .then((response) => {
        this.updateReviews({ response });
      });
  }
};

export default commonSenseMediaActions;
