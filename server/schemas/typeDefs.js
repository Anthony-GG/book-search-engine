const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]!
  }

  type Book {
    authors: [String]!
    description: String!
    bookId: String!
    image: String!
    link: String
    title: String!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    user(userId:String!): User!
  }

  type Mutation {
    login(email: String!, password: String!): Auth!
    addUser(username: String!, email: String!, password: String!): Auth!
    saveBook(
      authors: [String]!,
      description: String!,
      title: String!,
      bookId: String!,
      image: String!,
      link: String,
      userId: String!
    ): User
    removeBook(bookId: String!): User!
  }
`;

module.exports = typeDefs;
