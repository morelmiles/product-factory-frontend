import logger from 'redux-logger';
import {applyMiddleware, createStore, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {MakeStore, createWrapper, Context} from 'next-redux-wrapper';
import { rootSaga } from './sagas';
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

const SET_CLIENT_STATE = 'SET_CLIENT_STATE';

export const reducer = (state, {type, payload}) => {
    // Usual stuff with HYDRATE handler
    if (type === SET_CLIENT_STATE) {
        return {
            ...state,
            fromClient: payload
        };
    }
    return state;
};

// const sagaMiddleware = createSagaMiddleware();

// const composeEnhancer =
//   (process.env.NODE_ENV !== 'production' &&
//     window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]) ||
//   compose;

const makeConfiguredStore = (reducer) =>
    createStore(reducer, undefined, applyMiddleware(logger));

const makeStore = () => {

    const isServer = typeof window === 'undefined';

    if (isServer) {

        return makeConfiguredStore(reducer);

    } else {

        // we need it only on client side
        const {persistStore, persistReducer} = require('redux-persist');
        const storage = require('redux-persist/lib/storage').default;

        const persistConfig = {
            key: 'nextjs',
            whitelist: ['fromClient'], // make sure it does not clash with server keys
            storage
        };

        const persistedReducer = persistReducer(persistConfig, reducer);
        const store = makeConfiguredStore(persistedReducer);

        store.__persistor = persistStore(store); // Nasty hack

        return store;
    }
};

export const wrapper = createWrapper(makeStore);
// sagaMiddleware.run(rootSaga);

export const setClientState = (clientState) => ({
    type: SET_CLIENT_STATE,
    payload: clientState
});



const createHttpLink = (headers) => {
    const httpLink = new HttpLink({
      uri: 'https://ready-panda-91.hasura.app/v1/graphql',
      credentials: 'include',
      headers, // auth token is fetched on the server side
      fetch,
    })
    return httpLink;
  }

export default function createApolloClient(initialState, headers) {
    const ssrMode = typeof window === 'undefined'
    let link
    if (ssrMode) {
      link = createHttpLink(headers) // executed on server
    }
    return new ApolloClient({
      ssrMode,
      link,
      cache: new InMemoryCache().restore(initialState),
    })
  }