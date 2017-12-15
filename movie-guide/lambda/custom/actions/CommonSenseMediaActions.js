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

function getRestaurantsByMeal(mealtype) {

    const list = [];
    for (let i = 0; i < movieReview.restaurants.length; i++) {

        if(movieReview.restaurants[i].meals.search(mealtype) >  -1) {
            list.push(movieReview.restaurants[i]);
        }
    }
    return list;
}

function getRestaurantByName(restaurantName) {

    const restaurant = {};
    for (let i = 0; i < movieReview.restaurants.length; i++) {

        if(movieReview.restaurants[i].name == restaurantName) {
            restaurant = movieReview.restaurants[i];
        }
    }
    return restaurant;
}

function getAttractionsByDistance(maxDistance) {

    const list = [];

    for (let i = 0; i < movieReview.attractions.length; i++) {

        if(parseInt(movieReview.attractions[i].distance) <= maxDistance) {
            list.push(movieReview.attractions[i]);
        }
    }
    return list;
}

function getWeather(callback) {
    const https = require('https');

    const req = https.request(myAPI, res => {
        res.setEncoding('utf8');
        const returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            const channelObj = JSON.parse(returnData).query.results.channel;

            const localTime = channelObj.lastBuildDate.toString();
            localTime = localTime.substring(17, 25).trim();

            const currentTemp = channelObj.item.condition.temp;

            const currentCondition = channelObj.item.condition.text;

            callback(localTime, currentTemp, currentCondition);

        });

    });
    req.end();
}

function randomArrayElement(array) {
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
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
