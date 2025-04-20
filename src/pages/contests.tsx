import Head from 'next/head';
import { NextPage } from 'next';
import ContestsTable from '../components/ContestsTable';

const contestsPage: NextPage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Head>
        <title>比赛列表</title>
        <meta name="description" content="List of available contests" />
      </Head>
      <ContestsTable/>    
    </div>
  );
};

export default contestsPage;