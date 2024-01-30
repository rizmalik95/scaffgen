import NextAuth from "next-auth";

import { authOptions } from "scaffold/server/auth";

export default NextAuth(authOptions);
