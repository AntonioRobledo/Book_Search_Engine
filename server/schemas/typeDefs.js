const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type Auth {
        token: String
        user: User
    }

    type Query {
        me: User
    }

    input SavedBookInput {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: SavedBookInput!): User
        removeBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;