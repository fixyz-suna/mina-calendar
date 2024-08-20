import { NextApiRequest, NextApiResponse } from "next";
import getGoogleOAuth2Client from "../auth/googleAuth";
import withSession from "@/lib/withSession";
import { google } from "googleapis";
import { Session } from "next-iron-session";

interface TimeRange {
  start: Date;
  end: Date;
}

interface NextApiRequestWithSession extends NextApiRequest {
  session: Session;
}

export default withSession(async function handler(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  try {
    const client = getGoogleOAuth2Client();

    const tokens = req.session.get("googleToken");
    if (!tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    client.setCredentials(tokens);

    const timeMin = new Date();
    const timeMax = new Date(timeMin.getTime() + 7 * 24 * 60 * 60 * 1000);

    const calendar = google.calendar({ version: 'v3', auth: client });

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: "primary" }],
      },
    });

    const busyTimes: TimeRange[] = response.data.calendars?.primary?.busy?.map(busy => {
      const start = busy.start ? new Date(busy.start) : timeMin;
      const end = busy.end ? new Date(busy.end) : timeMax;
      return { start, end };
    }) || [];

    const freeTimes = calculateFreeTimes(busyTimes, timeMin, timeMax);

    const formattedFreeTimes = freeTimes.map(time => ({
        start: time.start.toISOString(),
        end: time.end.toISOString()
      }));
      
    res.status(200).json({ freeTimes: formattedFreeTimes });

  } catch (error) {
    console.error("Error fetching free/busy times:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

function calculateFreeTimes(busyTimes: TimeRange[], timeMin: Date, timeMax: Date): TimeRange[] {
  const freeTimes: TimeRange[] = [];
  let lastEnd = timeMin;

  busyTimes.forEach((busyTime) => {
    if (lastEnd < busyTime.start) {
      freeTimes.push({ start: lastEnd, end: busyTime.start });
    }

    lastEnd = busyTime.end > lastEnd ? busyTime.end : lastEnd;
  });

  if (lastEnd < timeMax) {
    freeTimes.push({ start: lastEnd, end: timeMax });
  }

  return freeTimes;
}