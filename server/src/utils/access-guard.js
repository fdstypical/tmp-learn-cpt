export const AccessGuard = (opts) => (req, res, next) => {
  const accessRule = opts[req.method.toLowerCase()];
  const hasAccessRule =
    typeof accessRule === "boolean" || Array.isArray(accessRule);

  if (hasAccessRule) {
    if (accessRule === false)
      return res
        .status(400)
        .json({ status: 400, message: "Operation not allowed" });

    if (
      Array.isArray(accessRule) &&
      !accessRule.some((path) => req.path.includes(path))
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "Operation not allowed" });
    }
  }

  if (req.path.includes("/users"))
    return res.status(404).json({ status: 404, message: "Resource not found" });

  next();
};
