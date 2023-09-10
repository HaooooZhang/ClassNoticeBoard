import React, {Fragment} from 'react';
import Head from "next/head";

function Home() {
  return (
    <Fragment>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-auto">
        <div className="hero bg-base-100">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hello here!</h1>
              <p className="py-6">Connect with friends, meet new people, and chat securely. Customize your profile,
                express
                with emojis, and get support when needed. Follow our guidelines, and enjoy regular updates for a great
                chatting experience!</p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
