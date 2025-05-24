
import { useEffect, useState } from 'react';

import { Space, AutoComplete, Button, Form, Table, Card } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import useSearchHistory from '../hook/useSearchHistory';

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
  const zubieHistory = useSearchHistory('zubie'); 
  const xingbieHistory = useSearchHistory('xingbie');
  const [form] = Form.useForm();

  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meetName, setMeetName] = useState<string>('loading');
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [zubie, setZubie] = useState<string>('');
  const [xingbie, setXingbie] = useState<string>('');

  const [zubieList, setZubieList] = useState<string[]>([]);
  const xingbieList = ['男子', '女子', '混合']; 

  const handleSearch = () => {
    fetchData(); // 触发数据更新
  };

  const fetchMeetName = async () => {
    const name = await getContestName(mid);
    setMeetName(name);
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        mid: mid.toString(),
      });
      
      // 添加过滤参数（空值不添加）
      if (zubie) {
        params.append('zubie', zubie);
        zubieHistory.addHistory(zubie); 
      }
      if (xingbie) {
        params.append('xingbie', xingbie);
        xingbieHistory.addHistory(xingbie);
      }

      const response = await fetch(`/api/query_team_score?${params.toString()}`);

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

  const fetchZubieList = async () => {
    try {
      const params = new URLSearchParams({
        mid: mid.toString(),
      });

      const response = await fetch(`/api/query_project_zubie_list?${params.toString()}`);

      const data = await response.json();

      if (data.code !== 0) {
      throw new Error(data.info || 'Failed to fetch team scores');
      }

      setZubieList(data.results || []);
    } catch (err) {
      setZubieList([]);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (!mid) return;
    fetchData();
    fetchMeetName();
    fetchZubieList();
  }, [mid, refreshTrigger]);

  const columns = [
    {
      title: '排名',
      key: 'rank',
      render: (a: any, b: any, index: any) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      title: '团体名称',
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: '总分',
      dataIndex: 'total_score',
      key: 'total_score',
      render: (text: number) => text.toFixed(1),
    },
  ];

  return (
    <Card title={`${meetName} 团体总分排名`} style={{ padding: '20px', margin: '5px auto' }}>

      {loading && <p style={{ textAlign: 'center' }}>加载中...</p>}

      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '20px 0' }}>
          错误: {error}
        </div>
      )}

      <Form
        form={form}
        onFinish={handleSearch}
        autoComplete="off"
      >
        <AutoComplete
          options={zubieList.map(item => ({
            value: item,
            label: (
              <Space>
                <span>{item}</span>
              </Space>
            )
          }))}
          placeholder="选择组别，留空不指定"
          value={zubie}
          onChange={(e) => setZubie(e)}
          // onSearch={handleSearch}
          allowClear
          style={{ width: 200 }}
        />
        <AutoComplete
          options={xingbieList.map(item => ({
            value: item,
            label: (
              <Space>
                <span>{item}</span>
              </Space>
            )
          }))}
          placeholder="选择性别，留空不指定"
          value={xingbie}
          onChange={(e) => setXingbie(e)}
          // onSearch={handleSearch}
          allowClear
          style={{ width: 200 }}
        />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            htmlType="submit"
            loading={loading}
          >
            搜索
          </Button>
      </Form>

      {!loading && !error && (
        <Table
        columns={columns}
        dataSource={teamScores}
        rowKey="team"
        pagination={{
          current: currentPage,
          pageSize: itemsPerPage,
          total: teamScores.length,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: (page, newPageSize) => {
            setCurrentPage(page);
            if (newPageSize) setItemsPerPage(newPageSize);
          },
          onShowSizeChange: (current, size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          },
        }}
        style={{ marginTop: 20 }}
        locale={{ emptyText: '暂无数据' }}
      />
      )}
    </Card>
  );
}