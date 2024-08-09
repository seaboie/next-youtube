import connect from "@/app/lib/db";
import Blog from "@/app/lib/modals/blog";
import { nextResponseApiError } from "@/app/utils/api/util-error";
import { checkUserCategoryUserIdCategoryId } from "@/app/utils/check/check_user_category_userId_categoryId";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const checkError = await checkUserCategoryUserIdCategoryId(connect(), userId, categoryId);

    if (checkError) {
        return new NextResponse(
            JSON.stringify({ message: checkError.message }),
            {status: checkError.status}
        );
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
    return nextResponseApiError("Error in Fetching Blogs", err, 500);
  }
};

export const POST = async (request: Request) => {
    
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        const body = await request.json();
        const { title, description } = body;
        
    } catch (err) {
        return nextResponseApiError("", err, 500);
    }
}
