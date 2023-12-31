import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'; //imports the Apollo logic into the app
import { setContext } from '@apollo/client/link/context';

import Navbar from './components/Navbar';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//instance of the ApolloClient creation
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
});

function App() {
  return (
    <ApolloProvider client={client}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ApolloProvider>
  );
}

export default App;
