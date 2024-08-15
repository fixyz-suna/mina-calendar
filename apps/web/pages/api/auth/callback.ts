import { NextApiRequest, NextApiResponse } from "next";
import { getGoogleOAuth2Client } from "@/lib/auth";
import { google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = getGoogleOAuth2Client();
  const { code } = req.query;

  const { tokens } = await client.getToken(code as string);
  client.setCredentials(tokens);

  // ここでトークンをデータベースに保存するなどの処理を行う

  res.redirect("/"); // あるいは成功ページへリダイレクト
}