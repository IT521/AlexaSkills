const config = {
  skillName: 'Movie Guide',
  // TODO: Add Application ID
  appId: process.env.ALEXA_APP_ID,
  // Book Reviews courtesy of Common Sense Media API.
  commonSenseMediaApi: 'https://api.commonsense.org/v2/review/browse',
  // TODO: Add Common Sense Media API Key
  commonSenseMediaApiKey: process.env.CSM_API_KEY,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  commonSenseMediaDataTable: 'commonSenseMediaData'
};

export default config;
