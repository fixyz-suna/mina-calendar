import { NextApiRequest, NextApiResponse } from "next";
import getGoogleOAuth2Client from "./googleAuth";
import withSession from "@/lib/withSession";
import { Session } from "next-iron-session";

interface NextApiRequestWithSession extends NextApiRequest {
  session: Session;
}

export default withSession(async function handler(
  req: NextApiRequestWithSession,
  res: NextApiResponse
) {
  try {
    const client = getGoogleOAuth2Client();
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'コードパラメータがありません' });
    }

    const { tokens } = await client.getToken(code as string);
    client.setCredentials(tokens);

    req.session.set("googleToken", tokens);
    await req.session.save();

    res.redirect("/");
  } catch (error: unknown) {
    console.error("コールバックハンドラーでエラーが発生しました:", error);
    
    if (error instanceof Error) {
      const errorMessage = error.message;
      res.status(500).json({ error: `内部サーバーエラー: ${errorMessage}` });
    } else {
      res.status(500).json({ error: "内部サーバーエラー: 不明なエラーが発生しました" });
    }
  }
});