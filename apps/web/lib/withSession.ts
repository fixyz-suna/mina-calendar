import { NextApiRequest, NextApiResponse } from "next";
import { Session, withIronSession } from "next-iron-session";

export type NextIronRequest = NextApiRequest & { session: Session };
export type NextIronHandler = (
  req: NextIronRequest,
  res: NextApiResponse,
) => void | Promise<void>;

const withSession = (handler: NextIronHandler) =>
  withIronSession(handler, {
    password: "XVzCrbuK_RQXdpp6JocDKiM-wccL5vn4pNpjKvG_c3s",
    cookieName: "next-iron-session/examples/next.js",
    cookieOptions: {

      secure: process.env.NODE_ENV === "production",
    },
  });

export default withSession;