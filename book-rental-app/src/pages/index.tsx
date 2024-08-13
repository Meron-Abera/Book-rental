import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Signup from "./signup";
import Login from "./login";
import Dashboard from "./Admindashboard";
import BookUpdate from "./bookUploadforRent";
require('dotenv').config();

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Book Rental App</title>
        <meta name="description" content="Book Rental Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
                  <script src="https://www.gstatic.com/charts/loader.js" async></script>

        <Signup />
        <Login />
        <Dashboard />
        <BookUpdate/>
      </div>
    </>
  );
}
