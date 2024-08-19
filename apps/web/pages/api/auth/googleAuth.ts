import { google } from 'googleapis';

const getGoogleOAuth2Client = () => {
  const client = new google.auth.OAuth2(
    "34904850053-nri5eru2o14c2bp72sktrr1ctmfi8gmq.apps.googleusercontent.com",
    "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",
    "http://localhost:3000/api/auth/callback"
  );
  return client;
};

export default getGoogleOAuth2Client;