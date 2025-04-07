const jwt = require('jsonwebtoken');

const auth = (context) => {
    const authHeader = context.req.headers.authorization;
    if (!authHeader) {
        throw new Error('Authorization header must be provided');
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
        throw new Error('Authentication token must be Bearer [token]');
    }

    try {
        const user = jwt.verify(token, 'your_jwt_secret');
        return user;
    } catch (err) {
        throw new Error('Invalid/Expired token');
    }
};

module.exports = auth; 