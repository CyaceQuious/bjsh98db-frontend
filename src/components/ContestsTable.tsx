import { useState, useEffect } from 'react';
import Link from 'next/link';

import { PagerCurrent, PagerFooter, PagerHeader } from '../components/pager';

interface Contest {
  mid: number;
  name: string;
}

interface ApiResponse {
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

  const fetchContests = async () => {
	try {
	  const response = await fetch('/api/query_meet_list');
	  const data: ApiResponse = await response.json();
	  
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
					<td style={{ padding: '12px' }}>{
                      <Link href={{
                        pathname: '/meet',
                        query: { mid: contest.mid }
                      }}>
                        进入主页
                      </Link>
                    }</td>
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