import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';


interface Meet {
  name: string;
  mid: number;
}

interface ApiResponse {
  code: number;
  info: string;
  count: number;
  results: Meet[];
}

const MeetsPage: NextPage = () => {
  const [meets, setMeets] = useState<Meet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchMeets = async () => {
      try {
        const response = await fetch('/api/query_meet_list');
        const data: ApiResponse = await response.json();
        
        if (data.code === 0) {
          setMeets(data.results);
        } else {
          setError(data.info || 'Failed to fetch meets');
        }
      } catch (err) {
        setError('An error occurred while fetching meets');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeets();
  }, []);

  // 计算当前页数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = meets.slice(indexOfFirstItem, indexOfLastItem);
  

  // 改变页码
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>比赛列表</title>
        <meta name="description" content="所有比赛列表" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">比赛列表</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold">
            <div className="col-span-1">ID</div> 
            <div className="col-span-11">比赛名称</div>
          </div>
          
          {currentItems.length > 0 ? (
            currentItems.map((meet) => (
              <div 
                key={meet.mid} 
                className="grid grid-cols-12 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-1 text-gray-600">{meet.mid}</div>
                <div className="col-span-11">
                <Link href={{
                  pathname: '/group',
                  query: { mid: meet.mid }
                }}>
                  {meet.name}
                </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">暂无比赛数据</div>
          )}
        </div>
        <select 
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // 重置到第一页
          }}
          className="mr-4 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="5">5条/页</option>
          <option value="10">10条/页</option>
          <option value="20">20条/页</option>
          <option value="50">50条/页</option>
        </select>
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            
            {Array.from({ length: Math.ceil(meets.length / itemsPerPage) }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 border-t border-b border-gray-300 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {number}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage < Math.ceil(meets.length / itemsPerPage) ? currentPage + 1 : currentPage)}
              disabled={currentPage === Math.ceil(meets.length / itemsPerPage)}
              className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              下一页
            </button>
          </nav>
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          显示 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, meets.length)} 条，共 {meets.length} 条
        </div>
      </main>
    </div>
  );
};

export default MeetsPage;