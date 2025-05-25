import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Timeline } from 'antd';
import GroupScoreTable from '../components/GroupScoreTable';
import MeetProjectTable from '../components/MeetProjectTable';
import MeetManage from '../components/MeetManage';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function CompetitionTeamScore() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('group-score');
  
  const { mid } = router.query;
  let midNum = 0; 
  if (typeof mid === 'string') {
    midNum = parseInt(mid, 10);
  } else if (Array.isArray(mid)) {
    midNum = parseInt(mid[0], 10);
  }

  const isSystemAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);
  const isContestOfficial = useSelector((state: RootState) => state.auth.isContestOfficial.includes(midNum));

  const [refreshTrigger, setRefreshTrigger] = useState(1);

  if (!router.isReady) return <div>Loading...</div>;

  const handleRefresh = () => {
    console.log('meet.tsx: handleRefresh called')
    setRefreshTrigger(refreshTrigger + 1);
  };

  // 目录配置
  const sections = [
    ...(isSystemAdmin || isContestOfficial ? [{ id: 'meet-manage', title: '赛事管理', tag: '管理' }] : []),
    { id: 'group-score', title: '团体总分', tag: '计分' },
    { id: 'meet-project', title: '项目成绩', tag: '详情' },
  ];

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setActiveSection(id);
    }
  };

  return (
    <div style={{ display: 'flex', marginLeft: 200 }}>
      <Head>
        <title>比赛主页 - 赛事 {midNum}</title>
      </Head>
      
      {/* 左侧目录 - List样式 */}
      <div style={{
        position: 'fixed',
        left: 20,
        top: 100,
        width: 200,
        // backgroundColor: '#fff',
        // borderRadius: 8,
        // boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '16px'
      }}>
        <Timeline mode="left">
          {sections.map(item => (
            <Timeline.Item 
              key={item.id}
              dot={<div style={{
                width: 12,
                height: 12,
                background: activeSection === item.id ? '#1890ff' : '#ddd',
                borderRadius: '50%',
                cursor: 'pointer'
              }} onClick={() => handleClick(item.id)}/>}
            >
              <div 
                onClick={() => handleClick(item.id)}
                style={{
                  cursor: 'pointer',
                  paddingLeft: 16,
                  color: activeSection === item.id ? '#1890ff' : '#666',
                  fontWeight: activeSection === item.id ? 500 : 400
                }}
              >
                {item.title}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      {/* 右侧内容 */}
      <div style={{ flex: 1, padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        {(isSystemAdmin || isContestOfficial) && (
          <div id="meet-manage" style={{ scrollMarginTop: '80px' }}>
            <MeetManage mid={midNum} reload={handleRefresh}/>
          </div>
        )}
        
        <div id="group-score" style={{ scrollMarginTop: '80px' }}>
          <GroupScoreTable mid={midNum} refreshTrigger={refreshTrigger}/>
        </div>
        
        <div id="meet-project" style={{ scrollMarginTop: '80px' }}>
          <MeetProjectTable mid={midNum} refreshTrigger={refreshTrigger} onContentRefresh={handleRefresh}/>
        </div>
      </div>
    </div>
  );
}