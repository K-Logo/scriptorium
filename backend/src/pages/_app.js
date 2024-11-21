import '../styles/tailwind.css';
import "../styles/globals.css";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { UserContext, UserProvider } from "../contexts/user";
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Scriptorium</title>
        <meta name="description" content="The new way of writing code!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <UserProvider>
        <Navbar />
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}
