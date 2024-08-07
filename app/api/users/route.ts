import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { nextResponseApiError } from "@/app/utils/api/util-error";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    // 1. connect() DB
    await connect();
    // 2.
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (err: unknown) {
    return nextResponseApiError("Error fetching users... ", err, 500);
  }
};

export const POST = async (request: Request) => {
  try {
    // get data from `request.json()` keep in `body` constant
    const body = await request.json();
    await connect();

    // Save new user data to database
    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "New User is created...", user: newUser }),
      { status: 200 }
    );
  } catch (err: unknown) {
    return nextResponseApiError("Error : cannot get new post user", err, 500);
  }
};
