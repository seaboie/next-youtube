import Category from "@/app/lib/modals/category";
import User from "@/app/lib/modals/user";
import { Types } from "mongoose";

export const checkUserCategoryUserIdCategoryId = async (
  connect: Promise<void>,
  userId: string | null,
  categoryId: string | null
) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return { status: 400, message: "Invalid or missing userId" };
  }

  if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
    return { status: 400, message: "Invalid or missing categoryId" };
  }

  await connect;

  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, message: "User not found..." };
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return { status: 404, message: "Category not found" };
  }
};
