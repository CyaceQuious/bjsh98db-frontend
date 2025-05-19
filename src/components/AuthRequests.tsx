import React, { useState, useMemo } from 'react';
import { Card, List, Tag, Button, Pagination } from 'antd';
import { AuthRequest } from '../utils/types';

interface AuthRequestsProps {
  authRequests: AuthRequest[];
  isDepartmentOfficial: boolean;
  receivedAuthRequests: AuthRequest[];
  onReviewRequest: (request: AuthRequest) => void;
}

const PAGE_SIZE = 5; // 每页显示的项目数

const AuthRequests: React.FC<AuthRequestsProps> = ({
  authRequests,
  isDepartmentOfficial,
  receivedAuthRequests,
  onReviewRequest,
}) => {
  // 收到的认证申请分页状态
  const [receivedCurrentPage, setReceivedCurrentPage] = useState(1);
  // 认证历史分页状态
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);

  // 按时间倒序排序收到的认证申请
  const sortedReceivedRequests = useMemo(() => {
    return [...receivedAuthRequests].sort((a, b) => 
      new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
    );
  }, [receivedAuthRequests]);

  // 按时间倒序排序认证历史
  const sortedAuthHistory = useMemo(() => {
    return [...authRequests].sort((a, b) => 
      new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
    );
  }, [authRequests]);

  // 计算分页后的数据
  const getPaginatedData = (data: AuthRequest[], currentPage: number) => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return data.slice(startIndex, endIndex);
  };

  return (
    <>
      {isDepartmentOfficial && (
        <div className="mt-6">
          <Card title="收到的认证申请" bordered={false}>
            <List
              dataSource={getPaginatedData(sortedReceivedRequests, receivedCurrentPage)}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    item.status === 0 ? (
                      <Button 
                        type="link" 
                        onClick={() => onReviewRequest(item)}
                      >
                        处理
                      </Button>
                    ) : undefined
                  ]}
                >
                  <List.Item.Meta
                    title={`${item.sender_username} 申请认证为 ${item.real_name}`}
                    description={
                      <>
                        <p>申请时间: {new Date(item.applied_at).toLocaleString()}</p>
                        {item.status === 0 && <Tag color="orange">待处理</Tag>}
                        {item.status === 1 && <Tag color="green">已通过</Tag>}
                        {item.status === 2 && (
                          <>
                            <Tag color="red">已拒绝</Tag>
                            <p>拒绝原因: {item.reject_reason}</p>
                          </>
                        )}
                        {item.replied_at && (
                          <p>处理时间: {new Date(item.replied_at).toLocaleString()}</p>
                        )}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
            <Pagination
              current={receivedCurrentPage}
              total={sortedReceivedRequests.length}
              pageSize={PAGE_SIZE}
              onChange={(page) => setReceivedCurrentPage(page)}
              style={{ marginTop: 16, textAlign: 'center' }}
              showSizeChanger={false}
            />
          </Card>
        </div>
      )}
      {authRequests.length > 0 && (
        <div className="mt-6">
          <Card title="认证历史" bordered={false}>
            <List
              dataSource={getPaginatedData(sortedAuthHistory, historyCurrentPage)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`申请认证为 ${item.real_name}`}
                    description={
                      <>
                        <p>审核人: {item.invited_reviewer}</p>
                        <p>申请时间: {new Date(item.applied_at).toLocaleString()}</p>
                        {item.status === 0 && <Tag color="orange">待处理</Tag>}
                        {item.status === 1 && <Tag color="green">已通过</Tag>}
                        {item.status === 2 && (
                          <>
                            <Tag color="red">已拒绝</Tag>
                            <p>拒绝原因: {item.reject_reason}</p>
                          </>
                        )}
                        {item.replied_at && (
                          <p>处理时间: {new Date(item.replied_at).toLocaleString()}</p>
                        )}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
            <Pagination
              current={historyCurrentPage}
              total={sortedAuthHistory.length}
              pageSize={PAGE_SIZE}
              onChange={(page) => setHistoryCurrentPage(page)}
              style={{ marginTop: 16, textAlign: 'center' }}
              showSizeChanger={false}
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default AuthRequests;