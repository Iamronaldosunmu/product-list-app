import jwt from 'jsonwebtoken';

const authMiddleware =  (req, res, next) => {
  // Get token from the header
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
    console.log(token);

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;  // Attach the user info to the request object
    next();                   // Pass control to the next middleware
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;