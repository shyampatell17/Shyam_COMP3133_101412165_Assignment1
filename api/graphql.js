const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('../config/db');
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');
const cors = require('cors');

const app = express();

// Configure CORS
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
connectDB().catch(err => console.error('MongoDB connection error:', err));

// Create Apollo Server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    introspection: true,
    playground: true,
});

// Apply middleware
apolloServer.start().then(() => {
    apolloServer.applyMiddleware({
        app,
        path: '/graphql',
        cors: false // Disable Apollo's CORS since we're using Express CORS
    });
});

// Add a root route handler
app.get('/', (req, res) => {
    res.send('GraphQL API is running at /graphql');
});

// Export the app
module.exports = app; 