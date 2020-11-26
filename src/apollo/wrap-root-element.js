import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './client.js';

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);