import { ApolloServer, gql } from 'apollo-server';
import { initContext } from '../database/db.js';

// Define gql schema
// @todo move to schema.js
const typeDef = gql`
    # Query and Mutation
    type Query {
        allUsers: [User]!
        userByUserId(id: ID!): User
        allLinks: [Link]!
        linkByLinkId(id: ID!): Link
        linksByUserId(id: ID!): [Link]
    }

    type User {
        id: ID!
        name: String!
        links: [Link]
    }

    type Link {
        id: ID!
        createdDateTime: String!
        title: String!
        url: String!
        type: LinkType!
        userId: String!
    }

    # Enums
    enum LinkType {
        CLASSIC
        SHOWS
        MUSICPLAYER
    }
`;

// Define a resolver
// @todo move to resolvers.js
const resolvers = {
    // Resolver functions are passed four arguments: parent, args, context, and info
    Query: {
        allUsers: (_, __, { UserService }) => UserService.allUsers(),
        userByUserId: (_, { id }, { UserService }) => UserService.userByUserId({ id }),
        allLinks: (_, __, { LinkService }) => LinkService.allLinks(),
        linkByLinkId: (_, { id }, { LinkService }) => LinkService.linkByLinkId({ id }),
        linksByUserId: (_, { id }, { LinkService }) => LinkService.linksByUserId({ id }),
    },
}

// Create ApolloServer
const server = new ApolloServer({
    typeDefs: typeDef,
    resolvers: resolvers,
    context: initContext()
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});