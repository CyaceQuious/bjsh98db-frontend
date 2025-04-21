
import { useEffect, useState } from 'react';

import { PagerCurrent, PagerFooter, PagerHeader } from '../components/pager';

import { getContestName } from '../utils/network';

interface TeamScore {
  team: string;
  total_score: number;
}

interface TeamScoreTableProps {
	mid: number; 
  refreshTrigger: any
}

export default function GroupScoreTable( {mid, refreshTrigger}: TeamScoreTableProps) {
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [meetName, setMeetName] = useState<string>('loading');
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchMeetName = async () => {
    const name = await getContestName(mid);
    setMeetName(name);
  }

  const fetchData = async () => {
	try {
	  setLoading(true);
	  const response = await fetch(`/api/query_team_score?mid=${mid}`);

	  const data = await response.json();

	  if (data.code !== 0) {
		throw new Error(data.info || 'Failed to fetch team scores');
	  }

	  setTeamScores(data.results || []);
	  setTotalItems(data.count || data.results.length);
	  setError('');
	} catch (err) {
	  setError(err instanceof Error ? err.message : 'Unknown error occurred');
	  setTeamScores([]);
	} finally {
	  setLoading(false);
	}
  };

  useEffect(() => {
    if (!mid) return;
    fetchData();
    fetchMeetName(); 
  }, [mid, refreshTrigger]);

  // 计算当前页的数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = teamScores.slice(indexOfFirstItem, indexOfLastItem);
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
        {meetName} 团体总分排名
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
              <th style={{ padding: '12px', textAlign: 'left' }}>排名</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>团体名称</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>总分</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? 
            (currentItems.map((team, index) => (
              <tr
                key={team.team}
                style={{
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                }}
              >
                <td style={{ padding: '12px' }}>{index + 1 + indexOfFirstItem}</td>
                <td style={{ padding: '12px' }}>{team.team}</td>
                <td style={{ padding: '12px' }}>{team.total_score.toFixed(1)}</td>
              </tr>
            ))) : (
              <tr>
                <td colSpan={3} className="py-4 px-4 border-b text-center text-gray-500">
                  暂无数据
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
}