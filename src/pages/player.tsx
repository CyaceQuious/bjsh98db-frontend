// pages/player.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface UserData {
  username: string;
  email: string;
  create_time: string;
  Is_Department_Official: boolean;
  Is_Contest_Official: string[];
  Is_System_Admin: boolean;
  star_list: string[];
}

interface ApiResponse {
  code: number;
  info: string;
  data: UserData;
}

const PlayerPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const [isStarred, setIsStarred] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const session = useSelector((state: RootState) => state.auth.session);

  const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
    try {
      const response = await fetch(url, options);
      
      // First check if response is HTML
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Server returned HTML instead of JSON');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.info || 'Request failed');
      }
      
      return data;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  };

  /*useEffect(() => {
    const checkIfStarred = async () => {
      if (!name || typeof name !== 'string' || !session) return;
      
      try {
        const params = new URLSearchParams();
        params.append('session', session);

        const data: ApiResponse = await fetchWithErrorHandling('/users/get_star_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        });

        setIsStarred(data.data.star_list.includes(name));
      } catch (err) {
        console.error('Error checking star status:', err);
        setError('Failed to load star status. Please try again.');
      }
    };

    checkIfStarred();
  }, [name, session]);*/

  const handleStarClick = async () => {
    if (!name || typeof name !== 'string') {
      setError('Player name is required');
      return;
    }

    if (!session) {
      setError('Please log in to follow players');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const endpoint = isStarred ? '/api/users/delete_star' : '/api/users/add_star';
      const params = new URLSearchParams();
      params.append('session', session);
      params.append('athlete_name', name);

      const data: ApiResponse = await fetchWithErrorHandling(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      setIsStarred(!isStarred);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!name) {
    return <div className="loading">Loading player information...</div>;
  }

  return (
    <div className="player-container">
      <h1>Player: {decodeURIComponent(name as string)}</h1>
      
      <div className="star-container">
        <button 
          onClick={handleStarClick}
          disabled={loading}
          aria-label={isStarred ? 'Unfollow player' : 'Follow player'}
          className="star-button"
        >
          {loading ? (
            <span className="loading-spinner">⌛</span>
          ) : isStarred ? (
            <span className="star starred">★</span>
          ) : (
            <span className="star">☆</span>
          )}
        </button>
        <span className="star-label">
          {loading ? 'Processing...' : isStarred ? 'Following' : 'Follow'}
        </span>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError('')} className="dismiss-button">
            ×
          </button>
        </div>
      )}

      <style jsx>{`
        .player-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1.5rem;
          text-align: center;
        }
        
        .star-container {
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .star-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        
        .star {
          font-size: 2.5rem;
          color: #ccc;
          transition: all 0.2s;
        }
        
        .star:hover {
          transform: scale(1.2);
        }
        
        .starred {
          color: gold;
        }
        
        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .error-message {
          color: #dc3545;
          background: #f8d7da;
          padding: 0.75rem;
          border-radius: 4px;
          margin: 1rem auto;
          max-width: 400px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .dismiss-button {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default PlayerPage;