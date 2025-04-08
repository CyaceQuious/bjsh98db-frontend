import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/contests.module.css';

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

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch('/api/query_meet_list');
        const data: ApiResponse = await response.json();
        
        if (data.code === 0) {
          // Sort by mid in descending order (just in case API doesn't)
          const sortedContests = [...data.results].sort((a, b) => b.mid - a.mid);
          setContests(sortedContests);
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
      {!loading && !error && (
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
              {contests.length > 0 ? (
                contests.map((contest) => (
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
      )}
    </div>
  );
};

export default contestsPage;