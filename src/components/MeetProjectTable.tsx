import { useState, useEffect } from 'react';
import { Button, Modal, Table, Card } from 'antd';
import { getContestName, request } from '../utils/network';
import { interfaceToString } from '../utils/types';
import SearchContainer from './SearchContainer';
import { SearchQuery, getEmptyQuery } from '../utils/types';
import ResultEditForm from './ResultEditForm';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import ProjectEditForm from './ProjectEditForm';
import ProjectDelForm from './ProjectDelForm';
import { ReloadOutlined, UnorderedListOutlined } from '@ant-design/icons';

interface Projects {
  name: string;
  leixing: string; 
  zubie: string;
  xingbie: string;
  id: number;
}

interface ApiRequest {
  mid: number; 
}

interface ApiResponse {
  code: number;
  info: string;
  count: number;
  results: Projects[];
}

interface MeetProjectTableProps {
  mid: number; 
  refreshTrigger: any; 
  onContentRefresh: () => any; 
}

export default function MeetProjectTable({mid, refreshTrigger, onContentRefresh}: MeetProjectTableProps) {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const [meetName, setMeetName] = useState<string>('loading');
  // 具体结果对话框
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [query, setQuery] = useState<SearchQuery>(getEmptyQuery());
  const [showProjectId, setShowProjectId] = useState<number>(0);

  const isSystemAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);
  const isContestOfficial = useSelector((state: RootState) => state.auth.isContestOfficial.includes(mid));

  const columns = [
    {
      title: '性别',
      dataIndex: 'xingbie',
      key: 'xingbie',
      filters: Array.from(new Set(projects.map(p => p.xingbie))).map(value => ({
        text: value,
        value
      })),
      onFilter: (value: any, record: Projects) => record.xingbie === value,
    },
    {
      title: '组别',
      dataIndex: 'zubie',
      key: 'zubie',
      filters: Array.from(new Set(projects.map(p => p.zubie))).map(value => ({
        text: value,
        value
      })),
      onFilter: (value: any, record: Projects) => record.zubie === value,
    },
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { 
      title: '类型',
      dataIndex: 'leixing',
      key: 'leixing',
      filters: Array.from(new Set(projects.map(p => p.leixing))).map(value => ({
        text: value,
        value
      })),
      onFilter: (value: any, record: Projects) => record.leixing === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: Projects) => (
        <>
        {meetName !== "loading" ? (
          <Button 
            variant="filled"
            color="green" 
            onClick={() => {
              setQuery({
                projectname: record.name,
                leixing: record.leixing,
                zubie: record.zubie,
                xingbie: record.xingbie,
                meet: meetName,
                page: 1,
                page_size: 10,
                precise: true
              });
              setShowProjectId(record.id);
              setShowDetailModal(true);
            }}
          >
            <UnorderedListOutlined/> 成绩
          </Button>
        ) : (
          <span>加载中...</span>
        )}
        {(isSystemAdmin || isContestOfficial)&&<ProjectEditForm 
          defaultValues={{
            meet: meetName,
            name: record.name,
            leixing: record.leixing,
            zubie: record.zubie,
            xingbie: record.xingbie,
          }}
          infoIds={{id: record.id}}
          isEditMode
          // buttonStyle={{ marginLeft: '10px'}}
          onSuccess={onContentRefresh}
          frozenItems={[
            "meet" 
          ]}
        />}
        {(isSystemAdmin || isContestOfficial)&&<ProjectDelForm
          values={{
            ...record,
            mid
          }}
          // buttonStyle={{ marginLeft: '10px'}}
          onSuccess={onContentRefresh}
        />}
        </>
      ),
    },
  ]; // 总是同步最新状态

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
      } else {
        setError(data.info || 'Failed to fetch projects');
      }
    } catch (err) {
      alert('An error occurred while fetching projects' + `${err}`); 
      setError('An error occurred while fetching projects' + `${err}`);
      console.log('Fetch error:', `${err}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetName = async () => {
    const name = await getContestName(mid);
    setMeetName(name);
  }

  const handleFresh = () => {
    fetchProjects();
    fetchMeetName(); 
    setShowDetailModal(false); 
    setQuery(getEmptyQuery());
  }

  useEffect(() => {
    handleFresh();
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchMeetName(); 
  }, [refreshTrigger]);

  return (
    <Card 
      title={<>{`${meetName} 全部比赛项目`}<Button type="text" onClick={handleFresh} icon={<ReloadOutlined/>} style={{ marginLeft: '10px' }}>刷新</Button></>}
      style={{ padding: '20px', margin: '5px auto', width: '100%'}}
    >

      {loading && <p style={{ textAlign: 'center' }}>加载中...</p>}

      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '20px 0' }}>
          错误: {error}
        </div>
      )}

      <Modal
        title={
          <div>
            查看项目成绩
            {/* 创建新成绩的按钮 */}
            {(isSystemAdmin || isContestOfficial) && 
            <ResultEditForm 
              useGray={true} 
              isEditMode={false}
              frozenItems={["meet", "projectname", "leixing", "zubie", "xingbie"]} 
              defaultValues={query}
              infoIds={{projectid: showProjectId}} 
              onSuccess={()=> {
                onContentRefresh(); 
                setQuery({...query}); 
              }}
            />}
          </div>
        }
        open={showDetailModal}
        footer={<></>}
        onClose={() => setShowDetailModal(false)}
        onCancel={() => setShowDetailModal(false)}
        width={'90%'}
      >
        <SearchContainer oldQuery={query} hiddenResult={false} onContentRefresh={onContentRefresh} frozeNames={["meet", "projectname", "leixing", "zubie", "xingbie", "precise", "ranked"]} searchJump={false} briefButton={true} initOpenAdvanced={true}/>
      </Modal>

      {!loading && !error && (
        <Table
          columns={columns}
          dataSource={projects}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 项`,
          }}
          bordered
          style={{ marginTop: 20 }}
        />
      )}
    </Card>
  );
};