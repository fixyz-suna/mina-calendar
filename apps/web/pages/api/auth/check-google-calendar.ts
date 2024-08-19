import { NextApiRequest, NextApiResponse } from "next";
import withSession from "@/lib/withSession";
import { Session } from "next-iron-session";

interface NextApiRequestWithSession extends NextApiRequest {
  session: Session;
}

export default withSession(function handler(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  try {
    if (req.session.get("googleToken")) {
      res.status(200).json({ isConnected: true });
    } else {
      res.status(200).json({ isConnected: false });
    }
  } catch (error) {
    console.error("check-google-calendarハンドラーでエラーが発生しました:", error);
    res.status(500).json({ error: "内部サーバーエラー" });
  }
});