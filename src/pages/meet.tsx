
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useState } from 'react';

import GroupScoreTable from '../components/GroupScoreTable';
import MeetProjectTable from '../components/MeetProjectTable';
import MeetManage from '../components/MeetManage';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function CompetitionTeamScore() {
  const router = useRouter();
  if (!router.isReady) return <div>Loading...</div>;
  const { mid } = router.query;
  let midNum: number = 0; 
  // 把mid转化为数字，如果是string[]则取第一个元素
  if (typeof mid === 'string') {
    midNum = parseInt(mid, 10);
  } else if (Array.isArray(mid)) {
    midNum = parseInt(mid[0], 10);
  }

  const isSystemAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);
  const isContestOfficial = useSelector((state: RootState) => state.auth.isContestOfficial.includes(midNum));

  const [refreshTrigger, setRefreshTrigger] = useState(1);
  const handleRefresh = () => {
    // 通过更新对象来触发重新渲染
    console.log('meet.tsx: handleRefresh called')
    setRefreshTrigger(refreshTrigger + 1);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <Head>
        <title>比赛团体总分 - 赛事 {midNum}</title>
      </Head>
      {(isSystemAdmin || isContestOfficial) && <MeetManage mid={midNum} reload={handleRefresh}/>}
      <GroupScoreTable mid={midNum} refreshTrigger={refreshTrigger}/>
      <MeetProjectTable mid={midNum} refreshTrigger={refreshTrigger} onContentRefresh={handleRefresh}/>
    </div>
  );
}