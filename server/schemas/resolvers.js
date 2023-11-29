const User = require("../models/User");
const Book = require("../models/Book");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // if statement checks if user is authenticated or not
      if (!context.req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      // gets current user based on ID of context
      const currentUser = await User.findById(context.req.user._id);
      return currentUser;
    },
  },
  Mutation: {
    login: (parent, { email, password }, context) => {
      // TODO: Implement the logic to handle user login
    },
    addUser: (parent, { username, email, password }, context) => {
      // TODO: Implement the logic to add a new user
    },
    saveBook: async (parent, args, context) => {
      // Checks if a user is authenticated
      if (!context.req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      try {
        // creates a new book based on Mongoose Book model
        const newBook = new Book({
          ...args,
        });

        // Saves the book to the database at large
        await newBook.save();

        // Updates the user's savedBooks array with the new book
        const updatedUser = await User.findByIdAndUpdate(
          context.req.user._id,
          { $push: { savedBooks: newBook } },
          { new: true }
        );

        return updatedUser;
      } catch (error) {
        console.error(error);
        throw new Error('Error saving the book');
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      // Checks if a user is authenticated
      if (!context.req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      try {
        // Removes the book from the Book collection
        await Book.findByIdAndRemove(bookId);

        // Removes the book from the user's savedBooks array
        const updatedUser = await User.findByIdAndUpdate(
          context.req.user._id,
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

