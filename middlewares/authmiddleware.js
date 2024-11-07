const jwt = require('jsonwebtoken');

const authenticateSupplier = (req, res, next) => {
  
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.error('No authorization header found');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
  
  if (!token) {
    console.error('No token found in authorization header');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

 

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    req.user = user; // Attach user to request object after verification
    next(); // Pass to the next middleware or route handler
  });
};

module.exports = authenticateSupplier;
