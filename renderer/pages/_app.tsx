import React, {Fragment, useRef} from 'react';
import type {AppProps} from 'next/app';

import '../styles/globals.css';
import Sidebar from "../components/sidebar";
import Settings from "../components/settings";

function MyApp({Component, pageProps}: AppProps) {
  const settingsRef = useRef(null);

  function openSettings() {
    settingsRef.current.open();
  }

  return (
    <Fragment>
      <div className="flex">
        <Sidebar openSettings={openSettings}/>
        <Component {...pageProps} />
      </div>
      <Settings ref={settingsRef}/>
    </Fragment>
  );
}


export default MyApp
