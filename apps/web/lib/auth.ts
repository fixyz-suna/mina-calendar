import { google } from "googleapis";

export const getGoogleOAuth2Client = () => {
  const client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/auth/callback"
  );
  return client;
};

export const getGoogleAuthURL = () => {
  const client = getGoogleOAuth2Client();
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
  });
  return url;
};
