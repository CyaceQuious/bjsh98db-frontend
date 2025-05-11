import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useRouter } from 'next/router';
import { Table, Spin, message } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';

interface EventResult {
  result: string | null;
  grade: string | null;
}

interface PlayerData {
  [eventName: string]: EventResult;
}

interface UserProfile {
  star_list: string[];
}

const PlayerPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const session = useSelector((state: RootState) => state.auth.session);
  
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // 获取选手数据 - GET方法
  useEffect(() => {
    if (!name) return;
    
    const fetchPlayerData = async () => {
      try {
        const url = new URL('/api/query_personal_web', window.location.origin);
        url.searchParams.append('name', name as string);
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (data.code === 0) {
          setPlayerData(data.results);
        } else {
          message.error(data.info);
        }
      } catch (error) {
        message.error('获取选手数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [name]);
  
  // 获取用户信息 - GET方法
  useEffect(() => {
    if (!session) return;
    
    const fetchUserProfile = async () => {
      try {
        const url = new URL('/api/users/get_user_profile', window.location.origin);
        url.searchParams.append('session', session);
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (data.code === 0) {
          setUserProfile(data.data);
          setIsStarred(data.data.star_list.includes(name as string));
        }
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    };
    
    fetchUserProfile();
  }, [session, name]);
  
  // 处理关注/取消关注 - POST方法
  const handleStarClick = async () => {
    if (!session) {
      message.warning('请先登录');
      return;
    }
    
    try {
      const endpoint = isStarred ? '/api/users/delete_star' : '/api/users/add_star';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          session,
          athlete_name: name as string
        })
      });
      
      const data = await response.json();
      
      if (data.code === 0) {
        setIsStarred(!isStarred);
        message.success(isStarred ? '已取消关注' : '关注成功');
        setUserProfile(data.data);
      } else {
        message.error(data.info);
      }
    } catch (error) {
      message.error('操作失败');
    }
  };
  
  // 准备表格数据
  const tableData = playerData 
    ? Object.entries(playerData).map(([eventName, data]) => ({
        key: eventName,
        eventName,
        result: data.result || '暂无成绩',
        grade: data.grade || '暂无等级'
      }))
    : [];
  
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: '最好成绩(PB)',
      dataIndex: 'result',
      key: 'result',
    },
    {
      title: '等级',
      dataIndex: 'grade',
      key: 'grade',
    },
  ];
  
  return (
    <div className="player-page">
      <div className="player-header">
        <h1>{name}</h1>
        <div 
          className="star-button" 
          onClick={handleStarClick}
          style={{ cursor: 'pointer', fontSize: '24px' }}
        >
          {isStarred ? (
            <StarFilled style={{ color: '#ffcc00' }} />
          ) : (
            <StarOutlined />
          )}
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table 
          dataSource={tableData} 
          columns={columns} 
          pagination={false}
          style={{ marginTop: '20px' }}
          bordered
        />
      )}
      
      <style jsx>{`
        .player-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        .player-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default PlayerPage;