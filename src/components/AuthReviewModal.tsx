import React, { useState } from 'react';
import { Modal, Button, Descriptions, Input, message } from 'antd';
import { AuthRequest } from '../utils/types';

interface AuthReviewModalProps {
  visible: boolean;
  request: AuthRequest | undefined;
  onCancel: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  submitting: boolean;
}

const AuthReviewModal: React.FC<AuthReviewModalProps> = ({
  visible,
  request,
  onCancel,
  onApprove,
  onReject,
  submitting,
}) => {
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = () => {
    if (!rejectReason.trim()) {
      message.error('请填写拒绝原因');
      return;
    }
    onReject(rejectReason);
  };

  return (
    <Modal
      title="处理认证申请"
      open={visible}
      onCancel={onCancel}
      footer={undefined}
      destroyOnClose
    >
      {request && (
        <div>
          <Descriptions column={1}>
            <Descriptions.Item label="申请人">{request.sender_username}</Descriptions.Item>
            <Descriptions.Item label="申请认证为">{request.real_name}</Descriptions.Item>
            <Descriptions.Item label="申请时间">
              {new Date(request.applied_at).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-6">
            <Input.TextArea
              placeholder="拒绝原因（仅在拒绝时需要填写）"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mb-4"
            />

            <div className="flex justify-between">
              <Button 
                type="primary" 
                onClick={onApprove}
                loading={submitting}
              >
                通过认证
              </Button>
              <Button 
                danger 
                onClick={handleReject}
                loading={submitting}
              >
                拒绝认证
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AuthReviewModal;