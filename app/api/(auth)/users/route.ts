import connect from "@/app/lib/db";
import User from "@/app/lib/modals/user";
import { nextResponseApiError } from "@/app/utils/api/util-error";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// @@@  Get ..... ObjectId
const ObjectId = require("mongoose").Types.ObjectId;

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

export const PATCH = async (request: Request) => {
  try {
    // need userId for update user data
    const body = await request.json();
    const { userId, newUsername } = body;

    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({
          message:
            "🔥 🔥 🔥 🔥 🔥 Oops !!! :  Not found ::: userId or new username",
        }),
        {
          status: 400,
        }
      );
    }
    // Check Type of object ID
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "🔥 🔥 🔥 🔥 🔥 Oops !!! :  Invalid user ID",
        }),
        { status: 400 }
      );
    }

    const updateUser = await User.findOneAndUpdate(
      {
        _id: new ObjectId(userId), // Must use `ObjeciId` line 8
      },
      {
        username: newUsername,
      },
      {
        new: true,
      }
    );

    if (!updateUser) {
      return new NextResponse(
        JSON.stringify({
          message: "🔥 🔥 🔥 🔥 🔥 Oops !!! : User not found in database : ",
        }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "🎉 🎉 🎉 🎉 🎉 Successfully : User is updated... ",
        updateUser: updateUser,
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    return nextResponseApiError("", err, 500);
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          message: "🔥 🔥 🔥 🔥 🔥 Oops !!! : Not found userId",
        }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message:
            "🔥 🔥 🔥 🔥 🔥 Oops !!! :  Invalid structure type of Object ID",
        }),
        { status: 400 }
      );
    }

    await connect();

    const deleteUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

    if (!deleteUser) {
      return new NextResponse(
        JSON.stringify({
          message: "🔥 🔥 🔥 🔥 🔥 Oops !!! : User not found in the Database",
        }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "🎉 🎉 🎉 🎉 🎉 Successfully : User has been deleted", user: deleteUser
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error(`🔥 🔥 🔥 🔥 🔥 Oops !!! : Have error `, err);
    return nextResponseApiError(
      "🔥 🔥 🔥 🔥 🔥 Oops !!! : Error in delete user",
      err,
      500
    );
  }
};
