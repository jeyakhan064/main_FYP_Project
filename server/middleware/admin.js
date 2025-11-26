// Admin authorization middleware
// Must be used after the protect middleware to ensure req.user exists

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      message: 'Access denied. Admin privileges required.'
    });
  }
};

export default admin;
