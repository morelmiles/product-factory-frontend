import Head from 'next/head'
import Dashboard from '../components/Dashboard';
import Header from '../components/Header';
import withApollo from '../lib/apolloClient'


function Home() {
  return (
    <>
      <Header/>
      <Dashboard/>
    </>
  )
}
export default withApollo({ ssr: true })(Home);
