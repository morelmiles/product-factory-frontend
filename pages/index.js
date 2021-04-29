import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import withApollo from "../lib/apolloClient";
import ContainerFlex from "../components/ContainerFlex";
import {Layout} from "antd";
import Footer from "../components/Footer";


function Home() {
    return (
        <ContainerFlex>
            <Layout style={{minHeight: "100vh"}}>
                <Header />
                <Dashboard />
                <Footer />
            </Layout>
        </ContainerFlex>
    )
}

export default withApollo({ssr: true})(Home);
