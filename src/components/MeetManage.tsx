import { useState, useEffect } from 'react';

import { Button, Modal, Input, message } from 'antd'; 

import { EditOutlined, CloudDownloadOutlined } from '@ant-design/icons';

import { getContestName, request } from '../utils/network';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import ResultEditForm from "./ResultEditForm";
import ProjectEditForm from './ProjectEditForm';

interface MeetManageProps {
	mid: number; 
  reload: () => void;
}

interface RenameRequest {
  session: string;
  mid: number;
  name: string;
}

interface RenameResponse {
  code: number;
  info: string;
}

interface SyncMeetRequest {
  session: string;
  meet_list: number[]; 
}

interface SyncMeetResponse {
  code: number;
  info: string;
  update_meet_num: any; 
}

const MeetManage = ({mid, reload}: MeetManageProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  // 修改比赛名称
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedMid, setSelectedMid] = useState<number | undefined>(undefined);
  const [syncing, setSyncing] = useState<boolean>(false);

  const [meetName, setMeetName] = useState<string>('loading');
  const session = useSelector((state: RootState) => state.auth.session);
  const isSystemAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);

  const fetchMeetName = async () => {
    setLoading(true);
    const name = await getContestName(mid);
    setMeetName(name);
    setLoading(false);
  }; 

  // 修改比赛名称的相关函数
  const handleRenameClick = (mid: number, currentName: string) => {
    setSelectedMid(mid);
    setNewName(currentName);
    setShowModifyModal(true);
  };
  const handleRenameConfirm = async () => {
    setLoading(true);
    console.log(`修改比赛ID ${selectedMid} 的名称为: ${newName}`);
    setShowModifyModal(false);
    putRenameRequest();
  };
  const handleRenameCancel = () => {
    setShowModifyModal(false);
    setNewName('');
    setSelectedMid(undefined);
  };
  const putRenameRequest = async () => {
    // setLoading(true);
    console.log(`session = ${session}`)
    try {
      const data: RenameResponse = await request(
        `/api/manage_meet`, 
        'PUT', 
        {
          session, 
          mid: selectedMid, 
          name: newName
        } as RenameRequest, 
        false, 
        'json'
      ); 
      if (data.code !== 0) {
        alert(data.info || 'Failed to rename project');
      }
      message.success('修改赛事名称成功');
      // await fetchContests();
      reload();
      fetchMeetName(); // 重新获取比赛名称
    } catch (err) {
      alert('An error occurred while renaming project' + err); 
      // setError('An error occurred while renaming project' + err);
      console.log('Put error:', err);
    } finally {
      // setLoading(false);
    }
  };

  // 同步比赛相关函数
  const handleSyncMeet = async () => {
    console.log('同步比赛列表');
    await putSyncMeetRequest();
  };
  const putSyncMeetRequest = async () => {
    setSyncing(true);
    try {
      const data: SyncMeetResponse = await request(
        `/api/update_new_result_from_online`, 
        'PUT', 
        {
          session, 
          meet_list: [mid], 
        } as SyncMeetRequest, 
        false, 
        'json'
      );
      if (data.code !== 0) {
        alert(data.info || 'Failed to sync project');
      }
      message.success(`比赛同步成功, 更新条目数: ${Object.values(data.update_meet_num)}`);
      reload();
      fetchMeetName(); // 重新获取比赛名称
    } catch (err) {
      message.error('比赛同步失败: ' + err);
      console.log('Put error:', err);
    } finally {
      // setLoading(false);
      setSyncing(false);
    }
  }

  useEffect(() => {
    fetchMeetName();
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        赛事管理
      </h1>

      <Modal
        title="修改比赛名称"
        open={showModifyModal}
        onOk={handleRenameConfirm}
        onCancel={handleRenameCancel}
        okText="确认"
        cancelText="取消"
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="请输入新比赛名称"
        />
      </Modal>

      {!loading && <div>
      {/* <ResultEditForm 
        buttonStyle={{ marginLeft: 16 }}
        defaultValues={{mid, meet: meetName}} 
        onSuccess={() => reload()}
        frozenItems={["meet", "mid"]}
      /> */}
      <ProjectEditForm
        buttonStyle={{ marginLeft: 16 }}
        defaultValues={{mid, meet: meetName}}
        onSuccess={() => reload()}
        frozenItems={["meet", "mid"]}
      />
      <Button
        type={'primary'}
        style={{ marginLeft: 16 }}
        onClick={() => handleSyncMeet()}
        disabled={syncing}
        loading={syncing}
        icon={<CloudDownloadOutlined />}
      >
        同步赛事成绩
      </Button>
      {(isSystemAdmin) && <Button
        type={'primary'}
        style={{ marginLeft: 16 }}
        onClick={() => handleRenameClick(mid, "no name now")}
        icon={<EditOutlined />}
      >
        修改赛事名称
      </Button>}
      </div>}
	</div>
  )
}

export default MeetManage; 