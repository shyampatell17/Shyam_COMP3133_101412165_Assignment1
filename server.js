const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

async function startServer() {
    try {
        const app = express();
        
        // Connect to MongoDB first
        await connectDB();

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => ({ req }),
            formatError: (error) => {
                // Log server-side errors
                console.error('GraphQL Error:', error);
                return error;
            }
        });

        await server.start();
        server.applyMiddleware({ app });

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
}

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
}); 