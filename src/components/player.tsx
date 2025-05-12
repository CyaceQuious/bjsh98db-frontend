import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Table, Spin, message, Modal } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';

interface EventResult {
  result: string | undefined;
  grade: string | undefined;
}

interface PlayerData {
  [eventName: string]: EventResult;
}

// interface UserProfile {
//   star_list: string[];
// }

interface PlayerModalProps {
  visible: boolean;
  name: string;
  onClose: () => void;
}

const PlayerModal = ({ visible, name, onClose }: PlayerModalProps) => {
  const session = useSelector((state: RootState) => state.auth.session);
  
  const [playerData, setPlayerData] = useState<PlayerData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  // const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  
  // 获取选手数据 - GET方法
  useEffect(() => {
    if (!name) return;
    
    const fetchPlayerData = async () => {
      try {
        const url = new URL('/api/query_personal_web', window.location.origin);
        url.searchParams.append('name', name);
        
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
        message.error(`获取选手数据失败: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (visible) {
      fetchPlayerData();
    }
  }, [name, visible]);
  
  // 获取用户信息 - GET方法
  useEffect(() => {
    if (!session || !visible) return;
    
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
          // setUserProfile(data.data);
          setIsStarred(data.data.star_list.includes(name));
        }
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    };
    
    fetchUserProfile();
  }, [session, name, visible]);
  
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
          athlete_name: name
        })
      });
      
      const data = await response.json();
      
      if (data.code === 0) {
        setIsStarred(!isStarred);
        message.success(isStarred ? '已取消关注' : '关注成功');
        // setUserProfile(data.data);
      } else {
        message.error(data.info);
      }
    } catch (error) {
      message.error(`操作失败: ${error}`);
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
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{name}</span>
          <div 
            className="star-button" 
            onClick={handleStarClick}
            style={{ cursor: 'pointer', fontSize: '24px', marginLeft: '16px' }}
          >
            {isStarred ? (
              <StarFilled style={{ color: '#ffcc00' }} />
            ) : (
              <StarOutlined />
            )}
          </div>
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={false}
      width={800}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table 
          dataSource={tableData} 
          columns={columns} 
          pagination={false}
          bordered
        />
      )}
    </Modal>
  );
};

export default PlayerModal;