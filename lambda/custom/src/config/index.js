const SKILL_NAME = 'Movie Guide';
module.exports = {
  skillName: SKILL_NAME,
  appId: process.env.ALEXA_APP_ID,
  // Book Reviews courtesy of Common Sense Media API.
  commonSenseMediaApi: 'https://api.commonsense.org/v2/review/browse',
  // TODO: Add Common Sense Media API Key to Environment Variables
  commonSenseMediaApiKey: process.env.CSM_API_KEY,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  commonSenseMediaDataTable: 'commonSenseMediaData',
  welcomeText: `Welcome to ${SKILL_NAME}!`,
  helpText: ['Say tell me about, or describe, to hear a description of the movie,',
    'or say review, or parental guidelines, to hear what parents need to know about the movie,',
    'or say user reviews, or say talking points, or say tell me if good, or say age rating,',
    'or say star rating, or say details.'],
  aboutText: [`Ask ${SKILL_NAME} for the review from commonsensemedia.org;`,
    'which provides parents with movie reviews',
    'that helps them to find out what content is not only age-appropriate',
    'but also developmentally appropriate for their child.'],
  stopText: 'Okay, see you next time!'
};
