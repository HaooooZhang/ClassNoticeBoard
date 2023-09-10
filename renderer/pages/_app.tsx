import React, {Fragment, useRef} from 'react';
import type {AppProps} from 'next/app';

import '../styles/globals.css';
import Sidebar from "../components/sidebar";
import Settings from "../components/settings";
import {useRouter} from "next/router";

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter()

  const settingsRef = useRef(null);

  function openSettings() {
    settingsRef.current.open();
  }

  return (
    <Fragment>
      <div className="flex">
        <Sidebar openSettings={openSettings}/>
        <Component {...pageProps} key={router.asPath} />
      </div>
      <Settings ref={settingsRef}/>
    </Fragment>
  );
}


export default MyApp
