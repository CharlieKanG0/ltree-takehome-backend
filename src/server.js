import { ApolloServer, gql } from 'apollo-server';
import { initContext } from './resolverService.js';

// Define gql schema
// @TODO move to schema.js
const typeDef = gql`
    # Query and Mutation
    type Query {
        allUsers: [User]!
        userByUserId(id: ID!): User
        allLinks: [Link]!
        linkByLinkId(id: ID!): Link
        linksByUserId(id: ID!, sortByDateAscending: Boolean): [Link]
    }

    type Mutation {
        addClassicLink(input: AddClassicLinkInput!): ClassicLink!
        # @TODO musiclink mutation
        # addMusicLink(input: AddClassicLinkInput!): MusicLink!
        addShowLink(input: AddShowLinkInput!): ShowLink!
    }

    # @TODO Add validation to schema directives using graphql-constraint-directive
    # e.g 
    # type User {
    #     id: ID!
    #     name: String! @constraint(pattern: "^[0-9a-zA-Z]*$", maxLength: 20)
    #     links: [Link] @constraint(pattern: URL regex)
    # }
    # type ClassicLink implements Link {
    #     title: String! @constraint(pattern: "^[0-9a-zA-Z]*$", maxLength: 144)
    # }


    # Input types
    input AddClassicLinkInput {
        title: String!
        url: String!
        type: LinkType!
        userId: String!
        queryParams: [String]
    }

    input AddShowLinkInput {
        title: String!
        url: String!
        type: LinkType!
        userId: String!
        shows: [ShowInput]!
    }

    input ShowInput {
        showDate: String!
        showName: String!
        isOnSale: Boolean!
        isSoldOut: Boolean!
    }

    # User type
    type User {
        id: ID!
        name: String!
        links: [Link]
    }

    # Link types
    interface Link {
        id: ID!
        createdDateTime: String!
        title: String!
        url: String!
        type: LinkType!
        userId: String!
    }

    type ClassicLink implements Link {
        id: ID!
        createdDateTime: String!
        title: String!
        url: String!
        type: LinkType!
        userId: String!

        queryParams: [String]
    }

    type Show {
        showDate: String!
        showName: String!
        isOnSale: Boolean!
        isSoldOut: Boolean!
    }

    type ShowLink implements Link{
        id: ID!
        createdDateTime: String!
        title: String!
        url: String!
        type: LinkType!
        userId: String!

        shows: [Show]!
    }

    type Music {
        mediaType: MediaType!
        MusicUrls: [String]! 
    }

    type MusicLink implements Link{
        id: ID!
        createdDateTime: String!
        title: String!
        url: String!
        type: LinkType!
        userId: String!

        musics: [Music]!
    }

    # Enums
    enum LinkType {
        CLASSIC
        SHOWS
        MUSICPLAYER
    }

    enum MediaType {
        SPOTIFY
        APPLE
        SOUNDCLOUD
        YOUTUBE
        DEEZER
        TIDAL
        BANDCAMP
    }
`;

// Define a resolver
// @TODO move to resolvers.js
const resolvers = {
    // Resolver functions are passed four arguments: parent, args, context, and info
    Query: {
        allUsers: (_, __, { UserService }) => UserService.allUsers(),
        userByUserId: (_, { id }, { UserService }) => UserService.userByUserId({ id }),
        allLinks: (_, __, { LinkService }) => LinkService.allLinks(),
        linkByLinkId: (_, { id }, { LinkService }) => LinkService.linkByLinkId({ id }),
        linksByUserId: (_, { id, sortByDateAscending }, { LinkService }) => LinkService.linksByUserId({ id, sortByDateAscending }),
    },

    Mutation: {
        addClassicLink: (_, { input }, { LinkService, DbContext }) => LinkService.addClassicLink({ classicLinkInput: input, db: DbContext }),
        addShowLink: (_, { input }, { LinkService, DbContext }) => LinkService.addShowLink({ showLinkInput: input, db: DbContext }),
        // @TODO musiclink mutation
    },

    // Resolver chain
    User: {
        links: (user, _, {LinkService}) => LinkService.linksByUserId({ id: user.id })
    },
    Link: {
        __resolveType(link) {
            switch (link.type) {
                case "CLASSIC": return 'ClassicLink';
                case "SHOWS": return 'ShowLink';
                case "MUSIC": return 'MusicLink';
                default: return 'ClassicLink';
            }
        }
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