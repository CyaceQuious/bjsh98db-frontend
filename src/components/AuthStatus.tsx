import React from 'react';
import { Card, Tag, Button } from 'antd';
import { AuthRequest } from '../utils/types';

interface AuthStatusProps {
  authRequests: AuthRequest[];
  onApplyAuth: () => void;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ authRequests, onApplyAuth }) => {
  const approvedRequest = authRequests.find(req => req.status === 1);
  const pendingRequest = authRequests.find(req => req.status === 0);

  if (approvedRequest) {
    return (
      <div className="mb-6">
        <Card title="认证状态" bordered={false}>
          <p className="text-lg">
            <Tag color="green">已认证</Tag> 您的认证姓名: {approvedRequest.real_name}
          </p>
          <p className="text-gray-500 mt-2">
            认证时间: {new Date(approvedRequest.replied_at || '').toLocaleString()}
          </p>
        </Card>
      </div>
    );
  }

  if (pendingRequest) {
    return (
      <div className="mb-6">
        <Card title="认证状态" bordered={false}>
          <p className="text-lg">
            <Tag color="orange">等待审核</Tag> 您已申请认证为: {pendingRequest.real_name}
          </p>
          <p className="text-gray-500 mt-2">
            申请时间: {new Date(pendingRequest.applied_at).toLocaleString()}
          </p>
          <p className="mt-2">
            审核人: {pendingRequest.invited_reviewer}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Card title="认证状态" bordered={false}>
        <p className="text-lg">
          <Tag color="red">未认证</Tag> 您还未进行实名认证
        </p>
        <Button 
          type="primary" 
          onClick={onApplyAuth}
          className="mt-4"
        >
          申请认证
        </Button>
      </Card>
    </div>
  );
};

export default AuthStatus;