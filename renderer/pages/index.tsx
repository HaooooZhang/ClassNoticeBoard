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
              <h1 className="text-5xl font-bold">欢迎！</h1>
              <p className="py-6">这是一个校园公告板程序，方便进行办公室与教室之间的联系。
                作为研究型课题的一部分，毫无疑问它是不完善的，在使用上的诸多不便还请见谅。
                也感谢各位在此课题上提供的各方各面的帮助。</p>
              <button className="btn btn-primary">让我们开始吧</button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
