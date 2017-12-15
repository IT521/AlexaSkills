'use strict';
module.change_code = 1;
import genericGetJSON from '../utilities/genericGetJSON';

// Movie Reviews courtesy of the Common Sense Media API.
const COMMON_SENSE_MEDIA_API = 'https://api.commonsense.org/v2/review/browse'
const COMMON_SENSE_MEDIA_API_KEY = '';
const fetchOptions = {
    "x-api-key": COMMON_SENSE_MEDIA_API_KEY
};
const params = {
	channel: 'movie'
};

const CommonSenseMediaFetcher = {
    /**
     * fetchMovieReviews() get all movie reviews in default JSON format
     */
    fetchMovieReviews: () => genericGetJSON(COMMON_SENSE_MEDIA_API, params, fetchOptions),
    /**
     * fetchUpdates() get movie reviews that are new or changed since given timestamp in default JSON format
     */
    fetchUpdates: timeStamp => genericGetJSON(COMMON_SENSE_MEDIA_API, {...params, delta: timeStamp}, fetchOptions)
};

export default CommonSenseMediaFetcher;
