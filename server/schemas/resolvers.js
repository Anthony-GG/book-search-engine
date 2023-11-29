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
    saveBook: (parent, args, context) => {
      // TODO: Implement the logic to save a book for the current user
    },
    removeBook: (parent, { bookId }, context) => {
      // TODO: Implement the logic to remove a book for the current user
    },
  },
};

module.exports = resolvers;

