import { gql } from '@apollo/client';

//this is a query that gets the current info of the current user
export const GET_USER = gql`
  query user($userId: String!) {
    user(userId: $userId) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
