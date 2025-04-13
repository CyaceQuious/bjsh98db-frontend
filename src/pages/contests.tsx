import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

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

const contestsPage: NextPage = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
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
      <Head>
        <title>比赛列表</title>
        <meta name="description" content="List of available contests" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Contests List</h1>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span>每页显示: </span>
          <select 
            value={itemsPerPage} 
            onChange={handleItemsPerPageChange}
            style={{ padding: '5px', marginLeft: '5px' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <span>共 {totalItems} 条记录</span>
        </div>
      </div>

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
                    <td style={{ padding: '12px' }}>{
                      <Link href={{
                        pathname: '/group',
                        query: { mid: contest.mid }
                      }}>
                        {contest.name}
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
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => paginate(1)} 
              disabled={currentPage === 1}
              style={{ 
                padding: '5px 10px', 
                margin: '0 5px', 
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              首页
            </button>
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              style={{ 
                padding: '5px 10px', 
                margin: '0 5px', 
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              上一页
            </button>
            
            {/* 页码显示 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // 显示当前页附近的页码
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  style={{
                    padding: '5px 10px',
                    margin: '0 5px',
                    fontWeight: currentPage === pageNumber ? 'bold' : 'normal',
                    backgroundColor: currentPage === pageNumber ? '#f0f0f0' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              style={{ 
                padding: '5px 10px', 
                margin: '0 5px', 
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              下一页
            </button>
            <button 
              onClick={() => paginate(totalPages)} 
              disabled={currentPage === totalPages}
              style={{ 
                padding: '5px 10px', 
                margin: '0 5px', 
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              末页
            </button>
          </div>
          
          {/* 当前页/总页数显示 */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span>第 {currentPage} 页 / 共 {totalPages} 页</span>
          </div>
        </>
      )}
    </div>
  );
};

export default contestsPage;