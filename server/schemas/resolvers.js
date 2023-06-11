const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // CREATE a user
        me: async (parent, args, context) => {

            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id
            })
            .select('-__v -password');

                return userData;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
          
            const user = await User.create( args );

            const token = signToken(user);

            return { token, user };
        },

        // Login a user 
        login: async (parent, { email, password }) => {

            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError('Incorrect email or password');
            }

            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword) {
                throw new AuthenticationError('Incorrect email or password');
            }

            const token = signToken(user);

            return { token, user };

        },
        // ADD a book to a user's saved books array
        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                   { _id: context.user._id },
                   { $push: { savedBooks: input }},
                   { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        // REMOVE a book from a user's saved books array
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId }}},
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    }
};

module.exports = resolvers;