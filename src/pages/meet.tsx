
import Head from 'next/head';
import { useRouter } from 'next/router';

import GroupScoreTable from '../components/GroupScoreTable';
import MeetProjectTable from '../components/MeetProjectTable';

export default function CompetitionTeamScore() {
  const router = useRouter();
  if (!router.isReady) return <div>Loading...</div>;
  const { mid } = router.query;
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Head>
        <title>比赛团体总分 - 赛事 {mid}</title>
      </Head>

      <GroupScoreTable mid={mid} />
      <MeetProjectTable mid={mid} />
    </div>
  );
}