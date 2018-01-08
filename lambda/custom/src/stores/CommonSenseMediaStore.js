const config = require('../config');
const alt = require('../altLib');
const CommonSenseMediaActions = require('../actions/CommonSenseMediaActions');

const dynasty = require('dynasty')(config.credentials);

class CommonSenseMediaStore {
  constructor() {
    this.state = {
      movieReview: {},
      movieReviews: []
    };

    // this.bindListeners({
    //   handleUpdateMovieReview: CommonSenseMediaActions.updateMovieReview,
    //   handleUpdateMovieReviews: CommonSenseMediaActions.updateMovieReviews
    // });
    this.bindActions(CommonSenseMediaActions);
  }
  /**
   * commonSenseMediaTable()
   */
  // eslint-disable-next-line object-shorthand
  static commonSenseMediaTable() {
    return dynasty.table(config.commonSenseMediaDataTable);
  }
  /**
   * createCommonSenseMediaTable()
   */
  // eslint-disable-next-line object-shorthand
  static createCommonSenseMediaTable() {
    // eslint-disable-next-line no-console
    console.log('createCommonSenseMediaTable');
    return dynasty.describe(config.commonSenseMediaDataTable)
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('createCommonSenseMediaTable: describe:', error);
        return dynasty.create(config.commonSenseMediaDataTable, {
          key_schema: {
            hash: ['uuid', 'string']
          }
        });
      });
  }
  /**
   * storeCommonSenseMediaData()
   */
  // eslint-disable-next-line object-shorthand
  static storeCommonSenseMediaData(commonSenseMediaData = []) {
    if (commonSenseMediaData.length) {
      commonSenseMediaData.forEach((data) => {
        // eslint-disable-next-line no-console
        console.log(`writing commonSenseMediaData to database for universal unique identifier of ${data.uuid}`);
        return CommonSenseMediaStore.commonSenseMediaTable().insert({
          uuid: data.uuid,
          data
          // eslint-disable-next-line no-console
        }).catch(error => console.log('storeCommonSenseMediaData', error));
      });
    }
  }
  /**
   * readCommonSenseMediaData()
   */
  // eslint-disable-next-line object-shorthand
  static readCommonSenseMediaData(uuid) {
    // eslint-disable-next-line no-console
    console.log(`reading commonSenseMediaData with universal unique identifier of ${uuid}`);
    return CommonSenseMediaStore.commonSenseMediaTable().find(uuid)
    // eslint-disable-next-line no-console
      .then(result => result).catch(error => console.log('readCommonSenseMediaData', error));
  }

  /**
   * handleUpdateMovieReview()
   */
  // eslint-disable-next-line func-names, object-shorthand
  handleUpdateMovieReview(review = {}) {
    this.setState({
      movieReview: review
    });
  }
  /**
   * handleUpdateMovieReviews()
   */
  // eslint-disable-next-line func-names, object-shorthand
  handleUpdateMovieReviews(movieReviews = []) {
    this.setState({
      movieReviews: movieReviews.slice()
    });
    CommonSenseMediaStore.storeCommonSenseMediaData(movieReviews);
  }
}

const commonSenseMediaStore = alt.createStore(CommonSenseMediaStore);
module.exports = commonSenseMediaStore;
