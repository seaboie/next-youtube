// User
export enum EnumMessageUsers {
  USER_CREATED = "User is created",
  USER_NOT_FOUND = "User not found...",
  INVALID_OR_MISSING_USER_ID = "Invalid or missing userId",
}

// Category
export enum EnumMessageCategorys {
  CATEGORY_CREATED = "Category is created",
  CATEGORY_NOT_FOUND = "Category not found...",
  INVALID_OR_MISSING_CATEGORY_ID = "Invalid or missing categoryId",
}

// Blog
export enum EnumMessageBlogs {
  BLOG_CREATED = "Blog is created",
  BLOG_NOT_FOUND = "Blog not found...",
  INVALID_OR_MISSING_BLOG_ID = "Invalid or missing blogId",
}

// Error Blogs
export enum EnumErrorMessageBlogs {
  ERROR_FETCHING_BLOGS = "Error in Fetching Blogs\n",
  ERROR_FECTHING_A_SPECIFIC_BLOG = "Error fetching a specific blog\n",
  ERROR_POST_A_NEW_BLOG = "Error post a new blog\n",
  ERROR_PATCH_A_SPECIFIC_BLOG = "Error update a specific blog",
  ERROR_DELETE_A_SPECIFIC_BLOG = "Error deleting a blog",
}
