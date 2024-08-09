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

    // Search
    const searchKeywords = searchParams.get("keywords") as string;
    // Start Date
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    // page
    const page = parseInt(searchParams.get("page") || "1");
    // limit
    const limit = parseInt(searchParams.get("limit") || "10");

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

    // TODO: Filtered
    if (searchKeywords) {
      filter.$or = [
        {
          title: { $regex: searchKeywords, $options: "i"},
        },
        {
          description: { $regex: searchKeywords, $options: "i"},
        }
      ]
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
        filter.createdAt = {
          $gte: new Date(startDate)
        };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate)
      }
    }

    // SKIP
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter).sort({createdAt: "asc"}).skip(skip).limit(limit);

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
