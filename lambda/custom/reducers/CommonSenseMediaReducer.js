// import _ from 'lodash';
import dynasty from 'dynasty';
import config from '../config';

dynasty(config.credentials);

const COMMONSENSEMEDIA_DATA_TABLE_NAME = config.commonSenseMediaDataTable;
const commonSenseMediaTable = () => dynasty.table(COMMONSENSEMEDIA_DATA_TABLE_NAME);

const commonSenseMediaReducer = {
  /**
   * createCommonSenseMediaTable()
   */
  createCommonSenseMediaTable: () => dynasty.describe(COMMONSENSEMEDIA_DATA_TABLE_NAME)
    .catch((error) => {
      console.log('createCommonSenseMediaTable: describe:', error);
      return dynasty.create(COMMONSENSEMEDIA_DATA_TABLE_NAME, {
        key_schema: {
          hash: ['uuid', 'string']
        }
      });
    }),
  /**
   * storeCommonSenseMediaData()
   */
  storeCommonSenseMediaData: (commonSenseMediaData = []) =>
    !!commonSenseMediaData.length && commonSenseMediaData.forEach((data) => {
      console.log('writing commonSenseMediadata to database for universal unique identifier of ', data.uuid);
      commonSenseMediaTable().insert({
        uuid: data.uuid,
        data
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
      .then(result => result)
      .catch((error) => {
        console.log(error);
      });
  }
};

export default commonSenseMediaReducer;
