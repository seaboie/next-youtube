import connect from "@/app/lib/db";
import Blog from "@/app/lib/modals/blog";
import User from "@/app/lib/modals/user";
import { nextResponseApiError } from "@/app/utils/api/util-error";
import {
  checkUserCategoryFindById,
  checkUserIdCategoryIdBlogId,
} from "@/app/utils/check/check_user_category_userId_categoryId";
import {
  EnumErrorMessageBlogs,
  EnumMessageBlogs,
  EnumMessageUsers,
} from "@/app/utils/enum/enum-message/enum_message";
import { getValueOfDynamicRoute } from "@/app/utils/route/util-route";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
  // const blogId = context.params[Object.keys(context.params)[0]];
  const blogId = getValueOfDynamicRoute(context);

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const checkErrorUserIdCategoryId = await checkUserIdCategoryIdBlogId(
      userId,
      categoryId,
      blogId
    );
    if (checkErrorUserIdCategoryId) {
      return new NextResponse(
        JSON.stringify({ message: checkErrorUserIdCategoryId.message }),
        { status: checkErrorUserIdCategoryId.status }
      );
    }

    await connect();

    const checkErrorUserCategory = await checkUserCategoryFindById(
      userId,
      categoryId
    );
    if (checkErrorUserCategory) {
      return new NextResponse(
        JSON.stringify({ message: checkErrorUserCategory.message }),
        { status: checkErrorUserCategory.status }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });

    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: EnumMessageBlogs.BLOG_NOT_FOUND }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
  } catch (err) {
    return nextResponseApiError(
      EnumErrorMessageBlogs.ERROR_FECTHING_A_SPECIFIC_BLOG,
      err,
      500
    );
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params[Object.keys(context.params)[0]];

  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return new NextResponse(
        JSON.stringify({ message: "Title and description are required" }),
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: EnumMessageUsers.INVALID_OR_MISSING_USER_ID,
        }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({
          message: EnumMessageBlogs.INVALID_OR_MISSING_BLOG_ID,
        }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: EnumMessageUsers.USER_NOT_FOUND }),
        { status: 404 }
      );
    }

    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: EnumMessageBlogs.BLOG_NOT_FOUND }),
        { status: 404 }
      );
    }

    const updateBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description }, //
      { new: true, runValidators: true } // Must have
    );

    return new NextResponse(
      JSON.stringify({
        message: EnumMessageBlogs.BLOG_UPDATED,
        blog: updateBlog,
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    return nextResponseApiError(
      EnumErrorMessageBlogs.ERROR_PATCH_A_SPECIFIC_BLOG,
      err,
      500
    );
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params[Object.keys(context.params)[0]];

  try {
    const { searchParams } = await new URL(request.url);
    const userId = searchParams.get("userId");
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
        return new NextResponse(
            JSON.stringify({ message: EnumMessageBlogs.INVALID_OR_MISSING_BLOG_ID}),
            {status: 400}
        );
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
        return new NextResponse(
            JSON.stringify({ message: EnumMessageUsers.INVALID_OR_MISSING_USER_ID}),
            {status: 400}
        );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
        return new NextResponse(
            JSON.stringify({ message: EnumMessageUsers.USER_NOT_FOUND}),
            {status: 404}
        );
    }

    const blog = await Blog.findOne({_id: blogId, user: userId});
    if (!blog) {
        return new NextResponse(
            JSON.stringify({message: EnumMessageBlogs.BLOG_NOT_FOUND}),
            {status: 404}
        );
    }

    await Blog.findByIdAndDelete(blogId);

    return new NextResponse(
        JSON.stringify({message: EnumMessageBlogs.BLOG_DELETED})
    )
    
  } catch (err) {
    return nextResponseApiError(
      EnumErrorMessageBlogs.ERROR_DELETE_A_SPECIFIC_BLOG,
      err,
      500
    );
  }
};
