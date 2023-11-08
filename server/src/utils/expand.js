export const Expand = (opts) => (req, res, next) => {
  const key = Object.keys(opts).find((key) => req.path.includes(key));

  if (!key) return next();

  const expandType = typeof req.query._expand;
  let expand = null;

  switch (expandType) {
    case "object":
      expand = Array.isArray(req.query._expand) ? req.query._expand : [];
      break;
    case "string":
      expand = [req.query._expand];
      break;
    default:
      expand = [];
  }

  req.query = {
    ...req.query,
    _expand: [...expand, ...opts[key]],
  };

  next();
};
