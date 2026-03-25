const ownershipMiddleware = (getResourceOwnerId) => {
  return async (req, res, next) => {
    const ownerId = await getResourceOwnerId(req);

    if (ownerId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden access",
      });
    }

    next();
  };
};

module.exports = ownershipMiddleware;