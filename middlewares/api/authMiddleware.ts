const validate = (token: any) => {
  const isValidToken = true;

  if (!isValidToken || !token) {
    return false;
  }
  return true;
};

export function authMiddleware(req: Request): any {
    const token = req.headers.get("authorization")?.split(" ")[1];
    return {isvalid: validate(token)};
}
