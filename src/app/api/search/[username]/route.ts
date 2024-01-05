/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, NextRequest } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      username: string;
    };
  },
) {
  try {
    const dbUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, params.username),
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }
    return NextResponse.json(dbUser.displayId, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
