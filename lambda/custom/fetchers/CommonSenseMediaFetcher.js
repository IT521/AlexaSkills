import genericGetJSON from '../utilities/genericGetJSON';
import config from '../config';

// Movie Reviews courtesy of the Common Sense Media API.
const fetchOptions = {
  'x-api-key': config.commonSenseMediaApiKey
};
const params = {
  channel: 'movie'
};

const CommonSenseMediaFetcher = {
  /**
   * fetchMovieReviews() get all movie reviews in default JSON format
   */
  fetchMovieReviews: () => genericGetJSON(config.commonSenseMediaApi, params, fetchOptions),
  /**
   * fetchUpdates() get movie reviews that are updated since given timestamp in default JSON format
   */
  fetchUpdates: timeStamp => genericGetJSON(
    config.commonSenseMediaApi,
    { ...params, delta: timeStamp },
    fetchOptions
  )
};

export default CommonSenseMediaFetcher;
