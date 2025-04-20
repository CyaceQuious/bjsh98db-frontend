import { useState, useEffect } from 'react';
import Link from 'next/link';
import { request } from '../utils/network';
import { interfaceToString } from '../utils/types';

import { PagerCurrent, PagerFooter, PagerHeader } from './pager';

interface Projects {
  name: string;
}

interface ApiRequest {
  mid: string; 
}

interface ApiResponse {
  code: number;
  info: string;
  count: number;
  results: Projects[];
}

interface MeetProjectTableProps {
	mid: string | string[] | undefined; 
}

export default function MeetProjectTable({mid}: MeetProjectTableProps) {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data: ApiResponse = await request(
        `/api/query_project_list?${interfaceToString({mid} as ApiRequest)}`, 
        'GET', 
        undefined, 
        false
      ); 
      if (data.code === 0) {
        setProjects(data.results);
        setTotalItems(data.count || data.results.length);
      } else {
        setError(data.info || 'Failed to fetch projects');
      }
    } catch (err) {
      alert('An error occurred while fetching projects' + err); 
      setError('An error occurred while fetching projects' + err);
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 计算当前页的数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
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
        赛事 #{mid} 全部比赛项目
      </h1>

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
                <th style={{ padding: '12px', textAlign: 'left' }}>项目名称</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((contest, index) => (
                  <tr
                    key={contest.name}
                    style={{
                      borderBottom: '1px solid #e0e0e0',
                      backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                    }}
                  >
                    <td style={{ padding: '12px' }}>{index}</td>
                    <td style={{ padding: '12px' }}>{
                      contest.name
                    }</td>
                    <td style={{ padding: '12px' }}>{
                      <Link href={{
                        pathname: '/project',
                        query: { mid: mid, project: contest.name }
                      }}>
                        管理成绩
                      </Link>
                    }</td>
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