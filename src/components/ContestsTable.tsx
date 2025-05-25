import { useState, useEffect } from 'react';

import { Button, Modal, Input, message, Form, Table, Card } from 'antd'; 

import { PlusOutlined, CloudDownloadOutlined, HomeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { request } from '../utils/network';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { useRouter } from 'next/router';

interface Contest {
  mid: number;
  name: string;
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

interface DeleteRequest {
  session: string;
  mid: number;
  name: string;
}

interface DeleteResponse {
  code: number;
  info: string;
}

interface NewMeetRequest {
  session: string;
  name: string;
}

interface NewMeetResponse {
  code: number;
  info: string;
  mid: number; 
}

interface SyncMeetRequest {
  session: string;
}

interface SyncMeetResponse {
  code: number;
  info: string;
  update_meet_num: any; 
}

interface ContestListResponse {
  code: number;
  info: string;
  count: number;
  results: Contest[];
}

export default function ContestsTable() {
  const router = useRouter();

  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [syncing, setSyncing] = useState<boolean>(false);
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  // 修改比赛名称
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedMid, setSelectedMid] = useState<number | undefined>(undefined);
  // 添加比赛
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newContestName, setNewContestName] = useState('');
  const [form] = Form.useForm();

  const session = useSelector((state: RootState) => state.auth.session);
  const isSystemAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);

  // 修改比赛名称的相关函数
  const handleRenameClick = (mid: number, currentName: string) => {
    setSelectedMid(mid);
    setNewName(currentName);
    setShowModifyModal(true);
  };
  const handleRenameConfirm = async () => {
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
    } catch (err) {
      alert('An error occurred while renaming project' + err); 
      // setError('An error occurred while renaming project' + err);
      console.log('Put error:', err);
    } finally {
      await fetchContests();
    }
  };

  // 获取比赛列表的相关函数
  const fetchContests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/query_meet_list');
      const data: ContestListResponse = await response.json();
      
      if (data.code === 0) {
        // Sort by mid in descending order (just in case API doesn't)
        const sortedContests = [...data.results].sort((a, b) => b.mid - a.mid);
        setContests(sortedContests);
        setTotalItems(data.count || sortedContests.length);
      } else {
        setError(data.info || 'Failed to fetch contests');
      }
    } catch (err) {
      setError('An error occurred while fetching contests');
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
    setError(undefined);
  }, []);

  // 删除比赛相关函数
  const handleDeleteClick = (mid: number, name: string) => {
    Modal.confirm({
      title: `确认删除比赛 ${name} ？`,
      content: '此操作不可撤销，请谨慎操作！',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log(`删除比赛ID: ${mid}, name: ${name}`);
        deleteMeetRequest(mid); 
        message.success(`删除 ${name} 操作已提交`);
      },
      onCancel() {
        message.info('已取消删除');
      },
    });
  };
  const deleteMeetRequest = async (mid: number) => {
    try {
      const data: DeleteResponse = await request(
        `/api/manage_meet`, 
        'DELETE', 
        {
          session, 
          mid, 
        } as DeleteRequest, 
        false, 
        'json'
      ); 
      if (data.code !== 0) {
        alert(data.info || 'Failed to delete project');
      }
    } catch (err) {
      alert('An error occurred while deleting project' + err); 
      // setError('An error occurred while renaming project' + err);
      console.log('Put error:', err);
    } finally {
      await fetchContests();
    }
  }

  // 添加比赛相关函数
  const handleCreateContest = async () => {
    console.log('创建新比赛:', newContestName);
    await postNewMeetRequest();
  };
  const postNewMeetRequest = async () => {
    try {
      const data: NewMeetResponse = await request(
        `/api/manage_meet`, 
        'POST', 
        {
          session, 
          name: newContestName, 
        } as NewMeetRequest, 
        false, 
        'json'
      );
      if (data.code !== 0) {
        alert(data.info || 'Failed to create project');
      }
      message.success(`比赛 ${newContestName} 创建成功, ID为: ${data.mid}`);
      setIsAddModalOpen(false);
      setNewContestName('');
    } catch (err) {
      message.error('创建比赛失败: ' + err);
      console.log('Put error:', err);
    } finally {
      await fetchContests();
    }
  }

  // 同步比赛相关函数
  const handleSyncMeet = async () => {
    console.log('同步比赛列表');
    await putSyncMeetRequest();
  };
  const putSyncMeetRequest = async () => {
    setSyncing(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5min超时
    try {
      const data: SyncMeetResponse = await request(
        `/api/update_new_meet_from_online`, 
        'PUT', 
        {
          session
        } as SyncMeetRequest, 
        false, 
        'json'
      );
      if (data.code !== 0) {
        alert(data.info || 'Failed to create project');
      }
      console.log(data.update_meet_num.length)
      message.success(`比赛同步成功, 更新比赛数: ${Object.keys(data.update_meet_num).length}`);
    } catch (err) {
      message.error('比赛同步失败: ' + err);
      console.log('Put error:', err);
    } finally {
      clearTimeout(timeoutId);
      setSyncing(false);
      await fetchContests();
    }
  }

  // 表格列配置
  const columns = [
    {
      title: '编号',
      dataIndex: 'mid',
      key: 'mid',
    },
    {
      title: '比赛名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Contest) => (
        <div style={{ display: 'flex', gap: '0' }}>
          <Button 
            variant="filled"
            color="green"
            icon={<HomeOutlined/>} 
            onClick={() => router.push(`/meet?mid=${record.mid}`)}
            // style={{ padding: 0 }}
          >
            主页
          </Button>
          {isSystemAdmin && (
            <>
              <Button
                variant="filled"
                color="primary"
                icon={<EditOutlined/>}
                onClick={() => handleRenameClick(record.mid, record.name)}
                // style={{ padding: 0 }}
              >
                修改名称
              </Button>
              <Button
                variant="filled"
                color="danger"
                icon={<DeleteOutlined/>}
                onClick={() => handleDeleteClick(record.mid, record.name)}
                // style={{ padding: 0 }}
              >
                删除比赛
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card title={
      <h1>比赛列表</h1>
    } extra={
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
      {isSystemAdmin && <Button 
          type="link" 
          onClick={() => setIsAddModalOpen(true)}
          style={{ 
            color: '#8c8c8c',
            fontSize: '16px',
            padding: '0px 12px',
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginRight: 8,
            // border: '1px solid #d9d9d9',
            // borderRadius: 6,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            fontWeight: 500,
          }}
          icon={<PlusOutlined/>}
        >
          新建比赛
        </Button>}
        {isSystemAdmin && <Button 
          type="link" 
          onClick={() => handleSyncMeet()}
          disabled={syncing}
          loading={syncing}
          style={{ 
            color: '#8c8c8c',
            fontSize: '16px',
            padding: '0px 12px',
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginRight: 8,
            // border: '1px solid #d9d9d9',
            // borderRadius: 6,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            fontWeight: 500,
          }}
          icon={<CloudDownloadOutlined/>}
        >
          同步比赛列表
        </Button>}
      </div>
    }>
      

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

      <Modal
        title="新建比赛"
        open={isAddModalOpen}
        onOk={handleCreateContest}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="比赛名称"
            name="contestName"
            rules={[{ required: true, message: '请输入比赛名称' }]}
          >
            <Input 
              placeholder="请输入比赛名称" 
              value={newContestName}
              onChange={(e) => setNewContestName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {loading && <p style={{ textAlign: 'center' }}>加载中...</p>}

      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '20px 0' }}>
          错误: {error}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={contests}
        rowKey="mid"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: totalItems,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setItemsPerPage(pageSize);
          },
          showTotal: (total) => `共 ${total} 项`,
        }}
        locale={{
          emptyText: error ? (
            <div style={{ color: 'red' }}>错误: {error}</div>
          ) : (
            '暂无数据'
          ),
        }}
      />
    </Card>
  );
};