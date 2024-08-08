import connect from "@/app/lib/db";
import Category from "@/app/lib/modals/category";
import User from "@/app/lib/modals/user";
import { nextResponseApiError } from "@/app/utils/api/util-error";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { getValueOfDynamicRoute } from "@/app/utils/route/util-route";

export const PATCH = async (request: Request, context: { params: any }) => {
  // const categoryId = context.params.category;
  // const categoryId = context.params[Object.keys(context.params)[0]];
  const categoryId = getValueOfDynamicRoute(context);

  try {
    const body = await request.json();
    const { title } = body;

    // Get userId
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: " Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: " Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Category is updated ",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    return nextResponseApiError("Erro updating category", err, 500);
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  // const categoryId = getValueOfDynamicRoute(context);
  // const categoryId = context.params.category;

  const categoryId = context.params[Object.keys(context.params)[0]];
  console.log(`🔨 🔨 🔨` + categoryId);
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId....." }),
        { status: 400 }
      );
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "" }), { status: 400 });
    }

    await connect();

    // Find userId from database
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findOne({
      _id: categoryId,
      user: userId,
    });
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found : or does not belong to the user",
        }),
        { status: 404 }
      );
    }

    await Category.findByIdAndDelete(categoryId);
    return new NextResponse(
      JSON.stringify({ message: "Category is deleted" }),
      { status: 200 }
    );
  } catch (err) {
    return nextResponseApiError("Error in deleting category", err, 500);
  }
};
