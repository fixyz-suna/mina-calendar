import { NextApiRequest, NextApiResponse } from "next";
import { getGoogleOAuth2Client } from "@/lib/auth";
import { google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tokens } = req.body;
  const client = getGoogleOAuth2Client();
  client.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: client });

  const calendarList = await calendar.calendarList.list();
  res.status(200).json({ calendarList: calendarList.data });
}