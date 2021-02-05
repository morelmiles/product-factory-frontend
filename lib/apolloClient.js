 import { ApolloClient, HttpLink, InMemoryCache } from 
 "@apollo/client";
 import { apiDomain } from '../utilities/constants';
 import { withApollo } from "next-apollo";


export const apolloClient = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: new HttpLink({
    uri: `${apiDomain}/graphql`, // Server URL (must be absolute)
    credentials: "same-origin" // Additional fetch() options like `credentials` or `headers`
  }),
  cache: new InMemoryCache()
});

export default withApollo(apolloClient);
  