import type { DefaultSession } from "next-auth";

import type { User } from "@/lib/types/db";

// We can add to the default session object by extending the
// built-in Session type from next-auth. This will allow us to
// use the properties we added to the user object in the
// database when accessing the session object in our app.

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: User; // 我們自己設定的type
  }
}

// declare module "next-auth/jwt" {
//   interface JWT {
//     user?: User; // 我們自己設定的type
//   }
// }

// import "next-auth";

// declare module "next-auth" {
//   interface User {
//     id: number;
//   }

//   interface Session {
//     user: User;
//   }
// }
