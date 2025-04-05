import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Meet, MeetsApiResponse } from "../utils/types"

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
          
          {meets.length > 0 ? (
            meets.map((meet) => (
              <div 
                key={meet.mid} 
                className="grid grid-cols-12 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-1 text-gray-600">{meet.mid}</div>
                <div className="col-span-11">{meet.name}</div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">暂无比赛数据</div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          共 {meets.length} 场比赛
        </div>
      </main>
    </div>
  );
};

export default MeetsPage;