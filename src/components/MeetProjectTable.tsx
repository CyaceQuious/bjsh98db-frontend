import { useState, useEffect } from 'react';

import { Button, Modal } from 'antd';

import { getContestName, request } from '../utils/network';
import { interfaceToString } from '../utils/types';

import { PagerCurrent, PagerFooter, PagerHeader } from './pager';

import SearchContainer from './SearchContainer';
import { SearchQuery, getEmptyQuery } from '../utils/types';
import ResultEditForm from './ResultEditForm';

interface Projects {
  name: string;
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
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  // 具体结果对话框
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [query, setQuery] = useState<SearchQuery>(getEmptyQuery());

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
        setTotalItems(data.count || data.results.length);
      } else {
        setError(data.info || 'Failed to fetch projects');
      }
    } catch (err) {
      alert('An error occurred while fetching projects' + err); 
      setError('An error occurred while fetching projects' + err);
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetName = async () => {
    const name = await getContestName(mid);
    setMeetName(name);
  }

  useEffect(() => {
    fetchProjects();
    fetchMeetName(); 
    setShowDetailModal(false); 
    setQuery(getEmptyQuery());
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  // 计算当前页的数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
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
        {meetName} 全部比赛项目
      </h1>

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
            <ResultEditForm useGray={true} frozenItems={["meet", "projectname"]} defaultValues={{...query, mid}} onSuccess={()=> {
              onContentRefresh(); 
              setQuery({...query}); 
            }}/>
          </div>
        }
        open={showDetailModal}
        footer={<></>}
        onClose={() => setShowDetailModal(false)}
        onCancel={() => setShowDetailModal(false)}
        width={'90%'}
      >
        <SearchContainer oldQuery={query} hiddenResult={false} onContentRefresh={onContentRefresh} frozeNames={["meet", "projectname", "precise", "ranked"]} searchJump={false} briefButton={true}/>
      </Modal>

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
                <th style={{ padding: '12px', textAlign: 'left' }}>项目名称</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((project, index) => (
                  <tr
                    key={project.name}
                    style={{
                      borderBottom: '1px solid #e0e0e0',
                      backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                    }}
                  >
                    <td style={{ padding: '12px' }}>{index +1+indexOfFirstItem}</td>
                    <td style={{ padding: '12px' }}>{
                      project.name
                    }</td>
                    <td style={{ padding: '12px' }}>{
                      <Button 
                        type="link" 
                        onClick={() => {
                          setQuery({projectname: project.name, meet: meetName, page: 1, page_size: 10} as SearchQuery);
                          setShowDetailModal(true);
                        }}
                        style={{ padding: 0 }}
                      >
                        查看成绩
                      </Button>
                      }</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 px-4 border-b text-center text-gray-500">
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