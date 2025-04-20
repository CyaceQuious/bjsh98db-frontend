import { useState, useEffect } from 'react';

import { Button, Modal, Input, message  } from 'antd'; 

import { PagerCurrent, PagerFooter, PagerHeader } from '../components/pager';
import { request } from '../utils/network';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Contest {
  mid: number;
  name: string;
}

interface RenameRequest {
  // session: string;
  mid: number;
  name: string;
}

interface RenameResponse {
  code: number;
  info: string;
}

interface ContestListResponse {
  code: number;
  info: string;
  count: number;
  results: Contest[];
}

export default function ContestsTable() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  // 修改比赛名称的模态框
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedMid, setSelectedMid] = useState<number | undefined>(undefined);

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
          session: session, 
          mid: selectedMid, 
          name: newName
        } as RenameRequest, 
        false, 
        'json'
      ); 
      if (data.code === 0) {
        await fetchContests();
      } else {
        setError(data.info || 'Failed to rename project');
      }
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
	  console.error('Fetch error:', err);
	} finally {
	  setLoading(false);
	}
  };

  useEffect(() => {
    fetchContests();
    setError(undefined);
  }, []);

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
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        比赛列表
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
                          href={`/meet?mid=${contest.mid}`}
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-4 px-4 border-b text-center text-gray-500">
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