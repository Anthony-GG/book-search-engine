const User = require("../models/User");
const Book = require("../models/Book");

const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      // if statement checks if user is authenticated or not

      const user = await User.findById(args.userId)

      if (!user) {
        throw new AuthenticationError('User not authenticated');
      }

      // gets current user based on ID of context
      const currentUser = await User.findById(args.userId);
      return currentUser;
    },
  },
  Mutation: {
    login: async (parent, { email, password }, context) => {
      try {
        // Searches for a user by written email
        const user = await User.findOne({ email });

        // Checks if the user exists and if the password written is correct
        if (!user || !user.isCorrectPassword(password)) {
          throw new AuthenticationError('Invalid email or password'); //email or password to not give away which one is wrong, better protection
        }

        // Generates a token and returns an Auth object with the token and user data
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error(error);
        throw new AuthenticationError('Error during login');
      }
    },
    addUser: async (parent, { username, email, password }, context) => {
      try {
        // Checks if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new AuthenticationError('A user with this email already exists');
        }

        // Creates a new user using the User model in models folder
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Generates a token and returns an Auth object with the token and user data
        const token = signToken(newUser);
        return { token, user: newUser };
      } catch (error) {
        console.error(error);
        throw new Error('Error adding a new user');
      }
    },
    saveBook: async (parent, args, context) => {
      // Checks if a user is authenticated

      const user = await User.findById(args.userId)

      if (!user) {
        throw new AuthenticationError('User not authenticated');
      }

      try {
        // creates a new book based on Mongoose Book model
        const newBook = new Book({
          bookId: args.bookId,
          authors: args.authors,
          description: args.description,
          title: args.title,
          image: args.image,
          link: args.link,
        });

        // Saves the book
        await newBook.save();

        // Updates the user's savedBooks array with the new book
        const updatedUser = await User.findOneAndUpdate(
          { _id: args.userId },
          { $addToSet: { savedBooks: newBook } },
          { new: true, runValidators: true }
      );

      console.log(updatedUser)

      if (!updatedUser) {
        throw new Error('User not found');
    }

        return updatedUser;
      } catch (error) {
        console.error(error);
        throw new Error('Error saving the book');
      }
    },
    removeBook: async (parent, { bookId, userId }, context) => {

      try {

        const user = await User.findById(userId)

        if (!user) {
          throw new AuthenticationError('User not authenticated');
        }

        // Removes the book from the Book collection
        await Book.findByIdAndRemove(bookId);

        // Removes the book from the user's savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      } catch (error) {
        console.error(error);
        throw new Error('Error removing the book');
      }
    },
  },
};

module.exports = resolvers;

