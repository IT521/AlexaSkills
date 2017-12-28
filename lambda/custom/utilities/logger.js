import log4js from 'log4js';

log4js.configure({
  appenders: { movieguide: { type: 'file', filename: 'movieguide.log' } },
  categories: { default: { appenders: ['movieguide'], level: 'error' } }
});

const logger = log4js.getLogger('movieguide');

export default logger;
