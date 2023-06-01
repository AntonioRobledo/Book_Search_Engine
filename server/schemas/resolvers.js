const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // CREATE a user
        me: async (parent, args, context) => {
            if (context.user) {
                User.findOne({ _id: context.user._id })
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        // Login a user 
        login: async (parent, args) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        // ADD a book to a user's saved books array
        saveBook: async (parent, { bookInput }, context) => {
            if (context.user) {
                const { authors, description, title, bookId, image, link } = bookInput;
                const user = await User.findByIdAndUpdate(
                   { _id: context.user._id },
                   { $push: { savedBooks: bookInput }},
                   { new: true }
                );
                return user;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        // REMOVE a book from a user's saved books array
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: { bookId }}},
                    { new: true }
                );
                return user;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

module.exports = resolvers;