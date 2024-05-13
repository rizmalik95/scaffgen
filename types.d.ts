import { Session } from "next-auth";

// Extend the Session interface to include accessToken
declare module "next-auth" {
  /**
   * Adds the `accessToken` to the `Session` object.
   */
  interface Session {
    accessToken?: string;
  }
}