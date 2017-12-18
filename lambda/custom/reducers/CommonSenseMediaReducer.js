'use strict';
module.change_code = 1;
const _ = require('lodash');
const dynasty = require('dynasty')({});

const COMMONSENSEMEDIA_DATA_TABLE_NAME = 'commonSenseMediaData';

const commonSenseMediaTable = () => dynasty.table(COMMONSENSEMEDIA_DATA_TABLE_NAME);

const CommonSenseMediaReducer = {
    /**
     * createCommonSenseMediaTable()
     */
    createCommonSenseMediaTable: () => {
	  return dynasty.describe(COMMONSENSEMEDIA_DATA_TABLE_NAME)
		.catch((error) => {
		  console.log('createCommonSenseMediaTable: describe:', error);
		  return dynasty.create(COMMONSENSEMEDIA_DATA_TABLE_NAME, {
			key_schema: {
			  hash: ['uuid', 'string']
			}
		  });
		});
	},
    /**
     * storeCommonSenseMediaData()
     */
    storeCommonSenseMediaData: (commonSenseMediaData = []) => !!commonSenseMediaData.length && commonSenseMediaData.forEach( (data) => {
	  console.log('writing commonSenseMediadata to database for universal unique identifier of ', data.uuid);
	  commonSenseMediaTable().insert({
		uuid: data.uuid,
		data: data
	  }).catch((error) => {
		console.log(error);
	  });
	}),
    /**
     * readCommonSenseMediaData()
     */
    readCommonSenseMediaData: (uuid) => {
	  console.log('reading commonSenseMedia with universal unique identifier of ', uuid);
	  return commonSenseMediaTable().find(uuid)
		.then((result) => {
		  return result;
		})
		.catch((error) => {
		  console.log(error);
		});
	}
};

export default CommonSenseMediaReducer;
