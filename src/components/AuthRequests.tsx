import React from 'react';
import { Card, List, Tag, Button } from 'antd';
import { AuthRequest } from '../utils/types';

interface AuthRequestsProps {
  authRequests: AuthRequest[];
  isDepartmentOfficial: boolean;
  receivedAuthRequests: AuthRequest[];
  onReviewRequest: (request: AuthRequest) => void;
}

const AuthRequests: React.FC<AuthRequestsProps> = ({
  authRequests,
  isDepartmentOfficial,
  receivedAuthRequests,
  onReviewRequest,
}) => {
  return (
    <>
      {authRequests.length > 0 && (
        <div className="mt-6">
          <Card title="认证历史" bordered={false}>
            <List
              dataSource={authRequests}
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
          </Card>
        </div>
      )}

      {isDepartmentOfficial && (
        <div className="mt-6">
          <Card title="收到的认证申请" bordered={false}>
            <List
              dataSource={receivedAuthRequests}
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
                    ) : null
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
          </Card>
        </div>
      )}
    </>
  );
};

export default AuthRequests;