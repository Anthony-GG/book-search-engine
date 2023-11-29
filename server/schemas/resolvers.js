import Book from "../models/Book";
import User from "../models/User";

const resolvers = {
  Query: {
    me: (parent, args, context) => {
      // TODO: Implement the logic to get the current user
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

