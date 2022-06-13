const { AuthenticationError } = require('apollo-server-express');
const { sign } = require('jsonwebtoken');
const { User, BookSchema } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password');
        return userData;
      }
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      console.log(user);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('this email is not associated with an account');
      }

      const correctPw = await User.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password')
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { userId, bookId }, context) => {
      if(context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $push: {savedBooks: { bookId }}},
          { new: true }
        );

        return updatedUser;
      }
    },
    deleteBook: async (parent, { userId, bookId }, context) => {
      if(context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId},
          { $pull: {savedBooks: { bookId }}},
          { new: true }
        );

        return updatedUser;
      }
    }

  }
};

module.exports = resolvers;