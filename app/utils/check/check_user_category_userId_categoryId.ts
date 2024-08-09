import Category from "@/app/lib/modals/category";
import User from "@/app/lib/modals/user";
import { Types } from "mongoose";
// import { EnumMessageUsers, } from '@/app/utils/enum/enum-message/enum_message';
import { EnumMessageUsers, EnumMessageCategorys, EnumMessageBlogs } from '@/app/utils/enum/enum-message/enum_message';

export const checkUserCategoryFindById = async (userId: string | null, categoryId: string | null) => {
  const user = await User.findById(userId);
  if (!user) {
    return {status: 404, message: EnumMessageUsers.USER_NOT_FOUND};
  }
   const category = await Category.findById(categoryId);
   if (!category) {
    return { status: 404, message: EnumMessageCategorys.CATEGORY_NOT_FOUND};
   }
}

export const checkUserCategoryUserIdCategoryId = async (
  connect: Promise<void>,
  userId: string | null,
  categoryId: string | null
) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return { status: 400, message: EnumMessageUsers.INVALID_OR_MISSING_USER_ID };
  }

  if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
    return { status: 400, message: EnumMessageCategorys.INVALID_OR_MISSING_CATEGORY_ID };
  }

  await connect;

  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, message: EnumMessageUsers.USER_NOT_FOUND };
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return { status: 404, message: EnumMessageCategorys.CATEGORY_NOT_FOUND};
  }

  return null;
};

export const checkUserIdCategoryIdBlogId = async (userId: string | null, categoryId: string | null, blogId: string | null) => {

  if (!userId || !Types.ObjectId.isValid(userId)) {
    return { status: 400, message: EnumMessageUsers.INVALID_OR_MISSING_USER_ID };
  }

  if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
    return { status: 400, message: EnumMessageCategorys.INVALID_OR_MISSING_CATEGORY_ID };
  }

  if (!blogId || !Types.ObjectId.isValid(blogId)) {
    return { status: 400, message: EnumMessageBlogs.INVALID_OR_MISSING_BLOG_ID};
  }

  return null;
}

