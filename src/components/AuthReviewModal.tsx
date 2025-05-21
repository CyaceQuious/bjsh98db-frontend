import React, { useState } from 'react';
import { Modal, Button, Descriptions, Input, message } from 'antd';
import { AuthRequest } from '../utils/types';

interface AuthReviewModalProps {
  visible: boolean;
  request: AuthRequest | undefined;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

const AuthReviewModal: React.FC<AuthReviewModalProps> = ({
  visible,
  request,
  onApprove,
  onReject,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const handleReject = () => {
    if (!rejectReason.trim()) {
      message.error('请填写拒绝原因');
      return;
    }
    setLocalSubmitting(true);
    onReject(rejectReason);
  };

  const handleApprove = () => {
    setLocalSubmitting(true);
    onApprove();
  };

  return (
    <Modal
      title="处理认证申请"
      open={visible}
      footer={null}
      closable={false}  // Disable the close button (X)
      maskClosable={false}  // Prevent closing by clicking outside
      keyboard={false}  // Prevent closing with ESC key
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
                onClick={handleApprove}
                loading={localSubmitting}
              >
                通过认证
              </Button>
              <Button 
                danger 
                onClick={handleReject}
                loading={localSubmitting}
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