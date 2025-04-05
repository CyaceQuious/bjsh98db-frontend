
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

interface TeamScore {
  team: string;
  total_score: number;
}

export default function CompetitionTeamScore() {
  const router = useRouter();
  const { mid } = router.query;
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!mid) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/query_team_score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mid: Number(mid) }),
        });

        const data = await response.json();

        if (data.code !== 0) {
          throw new Error(data.info || 'Failed to fetch team scores');
        }

        setTeamScores(data.results || []);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setTeamScores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mid]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Head>
        <title>比赛团体总分 - 赛事 {mid}</title>
      </Head>

      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        赛事 #{mid} 团体总分排名
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
              <th style={{ padding: '12px', textAlign: 'left' }}>排名</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>团体名称</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>总分</th>
            </tr>
          </thead>
          <tbody>
            {teamScores.map((team, index) => (
              <tr
                key={team.team}
                style={{
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                }}
              >
                <td style={{ padding: '12px' }}>{index + 1}</td>
                <td style={{ padding: '12px' }}>{team.team}</td>
                <td style={{ padding: '12px' }}>{team.total_score.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}