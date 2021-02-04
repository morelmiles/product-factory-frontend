import React from "react";
import App from "next/app";
import {useStore} from 'react-redux'
import {wrapper} from "../lib/redux";
import {PersistGate} from 'redux-persist/integration/react';
import { ApolloProvider } from "@apollo/client";
// import { useApollo } from "../lib/apolloClient";
import { apolloClient } from '../lib/apolloClient';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import '../styles/index.less';
import 'react-sortable-tree/style.css';

export default wrapper.withRedux(({Component, pageProps}) => {
    const store = useStore();
    // const apolloClient = useApollo(pageProps.initialApolloState);

    return (
        // <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
            // <ApolloProvider client={apolloClient}>
            
                <ApolloHooksProvider client={apolloClient}>
                    <Component {...pageProps} />
                </ApolloHooksProvider>
            // </ApolloProvider>
        // </PersistGate>
    );
});