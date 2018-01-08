const genericGetJSON = require('../utilities/genericGetJSON');
const config = require('../config');

// Movie Reviews courtesy of the Common Sense Media API.
const fetchOptions = {
  'x-api-key': config.commonSenseMediaApiKey
};

module.exports = {
  /**
   * fetchMovieReviews() get all movie reviews in default JSON format
   */
  fetchMovieReviews: () => genericGetJSON(config.commonSenseMediaApi, { channel: 'movie' }, fetchOptions),
  /**
   * fetchUpdates() get movie reviews that are updated since given timestamp in default JSON format
   * @param {Object[]} timeStamp - Timestamp when the review was last updated, in UTC format.
   */
  fetchUpdates: timeStamp => genericGetJSON(
    config.commonSenseMediaApi,
    { channel: 'movie', delta: timeStamp },
    fetchOptions
  )
};
