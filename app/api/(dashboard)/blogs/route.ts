import connect from "@/app/lib/db";
import Blog from "@/app/lib/modals/blog";
import { nextResponseApiError } from "@/app/utils/api/util-error";
import { checkUserCategoryUserIdCategoryId } from "@/app/utils/check/check_user_category_userId_categoryId";
import { EnumErrorMessageBlogs, EnumMessageBlogs } from "@/app/utils/enum/enum-message/enum_message";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const checkError = await checkUserCategoryUserIdCategoryId(
      connect(),
      userId,
      categoryId
    );

    if (checkError) {
      return new NextResponse(JSON.stringify({ message: checkError.message }), {
        status: checkError.status,
      });
    }
    // ---
    const filter: any = {
      user: new Types.ObjectId(userId!),
      category: new Types.ObjectId(categoryId!),
    };

    // TODO

    const blogs = await Blog.find(filter);

    return new NextResponse(JSON.stringify({ blogs }), { status: 200 });
  } catch (err) {
    return nextResponseApiError(
      EnumErrorMessageBlogs.ERROR_FETCHING_BLOGS,
      err,
      500
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const body = await request.json();
    const { title, description } = body;

    // Check error
    const checkError = await checkUserCategoryUserIdCategoryId(
      connect(),
      userId,
      categoryId
    );
    if (checkError) {
      return new NextResponse(JSON.stringify({ message: checkError.message }), {
        status: checkError.status,
      });
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId!),
      category: new Types.ObjectId(categoryId!),
    });

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({ message: EnumMessageBlogs.BLOG_CREATED, blog: newBlog }),
      { status: 200 }
    );
  } catch (err) {
    return nextResponseApiError(
      EnumErrorMessageBlogs.ERROR_POST_A_NEW_BLOG,
      err,
      500
    );
  }
};
