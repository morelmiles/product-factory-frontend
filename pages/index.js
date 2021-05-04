import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import withApollo from "../lib/apolloClient";
import ContainerFlex from "../components/ContainerFlex";
import { Layout } from "antd";
import Footer from "../components/Footer";
import Head from "next/head";

function Home() {
  return (
    <ContainerFlex>
      <Head>
        <title>OpenUnited</title>
        <meta
          name="description"
          content="Open United - OpenUnited is the place where communities - comprising contributors of all kinds - come together to create and contribute to Open Products."
        />
      </Head>
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <Dashboard />
        <Footer />
      </Layout>
    </ContainerFlex>
  );
}

export default withApollo({ ssr: true })(Home);
