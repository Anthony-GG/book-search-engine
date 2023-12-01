import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'; //imports the Apollo logic into the app

import Navbar from './components/Navbar';

function App() {
  return (
    <ApolloProvider client={ApolloClient}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ApolloProvider>
  );
}

export default App;
