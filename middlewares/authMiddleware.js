const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({
      status: 'Unauthorized',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
};
