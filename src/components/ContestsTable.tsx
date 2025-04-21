import { useState, useEffect } from 'react';

import { Button, Modal, Input, message, Form } from 'antd'; 

import { PlusOutlined } from '@ant-design/icons';

import { PagerCurrent, PagerFooter, PagerHeader } from '../components/pager';
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
    setLoading(true);
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
      await fetchContests();
    } catch (err) {
      alert('An error occurred while renaming project' + err); 
      // setError('An error occurred while renaming project' + err);
      console.log('Put error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取比赛列表的相关函数
  const fetchContests = async () => {
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
    setLoading(true);
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
      await fetchContests();
    } catch (err) {
      alert('An error occurred while deleting project' + err); 
      // setError('An error occurred while renaming project' + err);
      console.log('Put error:', err);
    } finally {
      setLoading(false);
    }
  }

  // 添加比赛相关函数
  const handleCreateContest = async () => {
    console.log('创建新比赛:', newContestName);
    await postNewMeetRequest();
  };
  const postNewMeetRequest = async () => {
    setLoading(true);
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
      await fetchContests();
    } catch (err) {
      message.error('创建比赛失败: ' + err);
      console.log('Put error:', err);
    } finally {
      setLoading(false);
    }
  }

  // 计算当前页的数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 改变页码
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // 改变每页显示数量
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // 重置到第一页
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>比赛列表</h1>
        {isSystemAdmin && <Button 
          type="link" 
          onClick={() => setIsAddModalOpen(true)}
          style={{ 
            color: '#8c8c8c',
            fontSize: '16px',
            padding: '0 12px',
            height: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            // border: '1px solid #d9d9d9',
            // borderRadius: 6,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            fontWeight: 500,
          }}
          icon={<PlusOutlined/>}
        >
          新建比赛
        </Button>}
      </div>

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

      {/* 分页控制 - 顶部 */}
      <PagerHeader itemsPerPage={itemsPerPage} totalItems={totalItems} handleItemsPerPageChange={handleItemsPerPageChange}/>

      {!loading && !error && (
        <>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>编号</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>比赛名称</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((contest) => (
                  <tr
                    key={contest.name}
                    style={{
                      borderBottom: '1px solid #e0e0e0',
                      backgroundColor: contest.mid % 2 === 0 ? '#fafafa' : 'white',
                    }}
                  >
                    <td style={{ padding: '12px' }}>{contest.mid}</td>
                    <td style={{ padding: '12px' }}>{contest.name}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                          type="link" 
                          onClick={() => router.push(`/meet?mid=${contest.mid}`)}
                          style={{ padding: 0 }}
                        >
                          进入主页
                        </Button>
                        {isSystemAdmin && <Button
                          type="link"
                          onClick={() => handleRenameClick(contest.mid, contest.name)}
                          style={{ padding: 0 }}
                        >
                          修改名称
                        </Button>}
                        {isSystemAdmin && <Button
                          type="link"
                          onClick={() => handleDeleteClick(contest.mid, contest.name)}
                          style={{ padding: 0 }}
                        >
                          删除比赛
                        </Button>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 px-4 border-b text-center text-gray-500">
                    No contests available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 分页控制 - 底部 */}
          <PagerFooter currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
          
          {/* 当前页/总页数显示 */}
          <PagerCurrent currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
};