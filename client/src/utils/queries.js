import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query user($email: String!){
    user(email: $email) {
      _id
      username
      email
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;