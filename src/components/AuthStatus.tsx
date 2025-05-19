import React, { useState } from 'react';
import { Card, Tag, Button } from 'antd';
import { AuthRequest } from '../utils/types';
import PlayerModal from '../components/player'; 

interface AuthStatusProps {
  authRequests: AuthRequest[];
  onApplyAuth: () => void;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ authRequests, onApplyAuth }) => {
  const approvedRequest = authRequests.find(req => req.status === 1);
  const pendingRequest = authRequests.find(req => req.status === 0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState('');

  if (approvedRequest) {
    return (
      <div className="mb-6">
        <Card title="认证状态" bordered={false}>
          <p className="text-lg">
            <Tag color="green">已认证</Tag> 您的认证姓名: 
            <span 
              style={{ color: '#2563eb', cursor: 'pointer' }}
              className="ml-1 underline hover:no-underline hover:text-blue-800"
              onClick={() => {
                setSelectedAthlete(approvedRequest.real_name);
                setModalVisible(true);
              }}
            >
              {approvedRequest.real_name}
            </span>
          </p>
          <p className="text-gray-500 mt-2">
            认证时间: {new Date(approvedRequest.replied_at || '').toLocaleString()}
          </p>
        </Card>

        {/* Player Modal for showing athlete details - same as before */}
        <PlayerModal
          visible={modalVisible}
          name={selectedAthlete}
          onClose={() => setModalVisible(false)}
        />
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