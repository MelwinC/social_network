import { ApolloServer } from '@apollo/server';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

export const createApolloServer = async () => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return { user: req.user };
    },
  });

  await apolloServer.start();

  return apolloServer;
};