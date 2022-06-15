import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { QUERY_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useMutation, useQuery } from '@apollo/client';

const SavedBooks = () => {
  const [userData, setUserData] = useState(Auth.getProfile().data);
  const email = Auth.getProfile().data.email;
  // use this to determine if `useEffect()` hook needs to run again
  console.log(email);
  console.log(userData);
  const { loading, data, error } = useQuery(QUERY_ME, {
    variables: {email: email}
  });
  if(loading){
    console.log(loading);
  } else {
    console.log(data);
  }
  const userDataLength = Object.keys(Auth.getProfile()).length;

  const user = data?.user || [];

  //setUserData(data);
  console.log(user);
  
  const [deleteBook] = useMutation(DELETE_BOOK);
  //console.log(useQuery(QUERY_ME));
  useEffect(() => {
  
    const getUserData = async () => {
      try {
        console.log('useEfect')
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        const person = Auth.getProfile();
        const userId = person.data._id;
        console.log(person);
        console.log(data);
        if (!token) {
          console.log('no token')
          return false;
        }

        if (!data) {
          throw new Error('something went wrong!');
        }

        const userr = await data;
        console.log(userr);
        setUserData(userr);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, []);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await deleteBook(bookId, token);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }
      //console.log(response);
      const updatedUser = await response.data;
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  console.log(userData);
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
