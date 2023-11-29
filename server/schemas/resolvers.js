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

