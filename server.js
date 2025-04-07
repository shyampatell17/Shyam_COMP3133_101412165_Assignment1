const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const app = express();

// Add a root route handler
app.get('/', (req, res) => {
    res.send('GraphQL API is running at /graphql');
});

let apolloServer = null;

async function startServer() {
    apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req }),
        formatError: (error) => {
            // Log server-side errors
            console.error('GraphQL Error:', error);
            return error;
        },
        introspection: true,  // Enable schema introspection
        playground: true      // Enable GraphiQL interface
    });

    await apolloServer.start();
    
    apolloServer.applyMiddleware({ 
        app,
        path: '/graphql',
        cors: {
            origin: '*',
            credentials: true
        }
    });
}

async function startApolloServer() {
    try {
        // Connect to MongoDB first
        await connectDB();
        await startServer();

        if (process.env.NODE_ENV !== 'production') {
            const PORT = process.env.PORT || 4000;
            app.listen(PORT, () => {
                console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
                console.log(`📈 GraphiQL available at http://localhost:${PORT}/graphql`);
            });
        }
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
}

startApolloServer();

// Export for Vercel
module.exports = app; 