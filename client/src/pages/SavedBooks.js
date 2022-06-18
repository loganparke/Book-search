import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { QUERY_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useMutation, useQuery } from '@apollo/client';

const SavedBooks = () => {
  const [userData, setUserData] = useState();
  const email = Auth.getProfile().data.email;
  // use this to determine if `useEffect()` hook needs to run again

  const { loading, data } = useQuery(QUERY_ME); 
  const [deleteBook] = useMutation(DELETE_BOOK);
  if(loading){
    return <h1>loading</h1>
  } 
  console.log(data);
  const user = data || [];
  


  // useEffect(() => {
  
  //   const getUserData = async () => {
  //     try {
  //       console.log('useEfect')
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;
  //       const person = Auth.getProfile();
  //       console.log(person);
  //       console.log(user);
  //       if (!token) {
  //         console.log('no token')
  //         return false;
  //       }

  //       if (!user) {
  //         throw new Error('something went wrong!');
  //       }

  //       if(data){
  //         console.log(user);
  //         setUserData(user);
  //       }
  //       // const userr = await data;

  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, []);

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
          {data?.user?.savedBooks?.length
            ? `Viewing ${data?.user?.savedBooks?.length} saved ${data?.user?.savedBooks?.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {data?.user?.savedBooks?.map((book) => {
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
