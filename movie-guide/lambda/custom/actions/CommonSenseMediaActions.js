'use strict';
module.change_code = 1;

// Fetcher
import CommonSenseMediaFetcher from '../fetchers/CommonSenseMediaFetcher';
import CommonSenseMediaReducer from '../reducers/CommonSenseMediaReducer';

/*
 * Helper Functions
 */

function getLatestTimestamp(movieReviews = []) {
  const timestamps = movieReviews.map(movieReview => movieReview.updated);
  return Math.max(...timestamps);
}

const CommonSenseMediaActions = {
    /**
     * createTable()
     */
    createTable: () => CommonSenseMediaReducer.createCommonSenseMediaTable(),
    /**
     * updateReviews()
     */
    updateReviews: (movieReviews = null) => CommonSenseMediaReducer.storeCommonSenseMediaData(movieReviews),
    /**
     * getReviews()
     */
    getReviews: () => {
	  return CommonSenseMediaFetcher.fetchMovieReviews()
		.then((response) => {
		  updateReviews(response).then(() => response);
		});
	},
    /**
     * getUpdates()
     */
    getUpdates: (movieReviews = []) => {
		const timestamp = getLatestTimestamp(movieReviews);
		return CommonSenseMediaFetcher.fetchUpdates(timestamp)
		  .then((response) => {
			updateReviews({response});
		  });
	}
};

export default CommonSenseMediaActions;
