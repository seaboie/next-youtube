import connect from "@/app/lib/db";
import Blog from "@/app/lib/modals/blog";
import { nextResponseApiError } from "@/app/utils/api/util-error";
import { checkUserCategoryFindById, checkUserIdCategoryIdBlogId } from "@/app/utils/check/check_user_category_userId_categoryId";
import { EnumErrorMessageBlogs, EnumMessageBlogs } from "@/app/utils/enum/enum-message/enum_message";
import { getValueOfDynamicRoute } from "@/app/utils/route/util-route";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
  // const blogId = context.params[Object.keys(context.params)[0]];
  const blogId = getValueOfDynamicRoute(context);

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const checkErrorUserIdCategoryId = await checkUserIdCategoryIdBlogId(userId, categoryId, blogId);
    if (checkErrorUserIdCategoryId) {
        return new NextResponse(
            JSON.stringify({message: checkErrorUserIdCategoryId.message}),
            {status: checkErrorUserIdCategoryId.status}
        );
    }

    await connect();

    const checkErrorUserCategory = await checkUserCategoryFindById(userId, categoryId);
    if (checkErrorUserCategory) {
        return new NextResponse(
            JSON.stringify({ message: checkErrorUserCategory.message}),
            {status: checkErrorUserCategory.status}
        );
    }

    const blog = await Blog.findOne(
        {
            _id: blogId,
            user: userId,
            category: categoryId
        }
    );

    if (!blog) {
        return new NextResponse(
            JSON.stringify({message: EnumMessageBlogs.BLOG_NOT_FOUND}),
            {status: 404}
        );
    }

    return new NextResponse(
        JSON.stringify({ blog }),
        {status: 200}
    );

    
  } catch (err) {
    return nextResponseApiError(
      EnumErrorMessageBlogs.ERROR_FECTHING_A_SPECIFIC_BLOG,
      err,
      500
    );
  }
};
