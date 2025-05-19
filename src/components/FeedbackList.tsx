import { useEffect, useState } from 'react';
import { Row, Col, Descriptions, Tag, Typography, List, Card, Empty, Pagination, Input, Button, Space,   message  } from 'antd';

export interface FeedbackItem {
  meet: string;
  mid: number;
  projectname: string;
  zubie: string;
  leixing: string;
  xingbie: string;
  name: string;
  groupname: string;
  applied_at: string;
  status: number;
  reject_reason?: string;
  apply_reason: string;
  replied_at?: string;
  id: number;
  resultid: number;
}

interface FeedbackListProps {
  data?: FeedbackItem[];
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange?: (page: number, pageSize: number) => void;
  loading?: boolean;
  mode: 'send' | 'receive';
  onReply?: (id: number, approval: boolean, reject_reason: string) => void;
}

const FeedbackList = ({
  data = [], 
  pagination,
  onPageChange,
  loading = false,
  mode,
  onReply,
}: FeedbackListProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(data[0]?.id || null);
  const [rejectReason, setRejectReason] = useState<string>('');
  
  // 当选中项变化时同步驳回理由
  useEffect(() => {
    const currentItem = data.find(item => item.id === selectedId);
    setRejectReason(currentItem?.reject_reason || '');
  }, [selectedId, data]);

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return { text: '待审核', color: 'blue' };
      case 1:
        return { text: '已通过', color: 'green' };
      case 2:
        return { text: '已驳回', color: 'red' };
      default:
        return { text: '未知状态', color: 'gray' };
    }
  };
  // 获取当前选中的反馈项
  const selectedItem = data.find(item => item.id === selectedId) || data[0];

  // 分页变化处理
  const handlePageChange = (page: number, pageSize: number) => {
    setSelectedId(null); // 清空选中项
    onPageChange?.(page, pageSize);
  };

  // 处理审核操作
  const handleReview = (id: number, approval: boolean) => {
    if (!approval && !rejectReason.trim()) {
      message.error('驳回时必须填写理由');
      return;
    }
    if (rejectReason.length > 300) {
      message.error('驳回理由不能超过300字');
      return;
    }
    onReply?.(id, approval, rejectReason);
  };

  return (
    <Row wrap={false} style={{ margin: -1 }}> 
      {/* 左侧列表 */}
      <Col xs={24} sm={8}>
        <Card title="反馈列表" variant='borderless'>
          <List
            dataSource={data}
            loading={loading}
            renderItem={item => (
              <List.Item
                onClick={() => setSelectedId(item.id)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedId === item.id ? '#f0f9ff' : 'inherit',
                  padding: '8px 16px'
                }}
              >
                <Typography.Text ellipsis style={{ width: '100%' }}>
                  {item.projectname} - {item.name}
                </Typography.Text>
                <Tag color={getStatusInfo(item.status).color} style={{ marginLeft: 8 }}>
                  {getStatusInfo(item.status).text}
                </Tag>
              </List.Item>
            )}
          />
        </Card>

        {/* 分页器 */}
        {pagination && (
          <div style={{ 
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            background: '#fff',
          }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              onShowSizeChange={handlePageChange}
              size="small"  // 启用紧凑模式
              // showSizeChanger
              showQuickJumper={false}  // 隐藏快速跳转（可选）
              showTotal={total => `共 ${total} 条`}
              style={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '4px',  // 控制元素间距
                fontSize: '12px'  // 调小字体
              }}
            />
          </div>
        )}

      </Col>

      {/* 右侧详情 */}
      <Col xs={24} sm={16} flex="auto" style={{ padding: 0 }}>
        {selectedItem ? (
          <Card title="反馈详情" variant='borderless'>
            <Descriptions
              bordered
              column={1}
              labelStyle={{ 
                width: 100,
                fontWeight: 'bold',
                backgroundColor: '#fafafa'
              }}
            >
              <Descriptions.Item label="赛事名称">{selectedItem.meet}</Descriptions.Item>
              <Descriptions.Item label="项目信息">
              {selectedItem.xingbie} · {selectedItem.zubie} · {selectedItem.projectname} · {selectedItem.leixing}
              </Descriptions.Item>
              <Descriptions.Item label="参赛者">
                {selectedItem.name} ({selectedItem.groupname})
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">
                {new Date(selectedItem.applied_at).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="处理时间">
                {selectedItem.replied_at ? 
                  new Date(selectedItem.replied_at).toLocaleString() : 
                  '待处理'}
              </Descriptions.Item>
              
              {/* 整合申请原因到Descriptions */}
              <Descriptions.Item label="申请原因" span={2}>
                <Typography.Paragraph style={{ margin: 0 }}>
                  {selectedItem.apply_reason}
                </Typography.Paragraph>
              </Descriptions.Item>

              {selectedItem.reject_reason && (
                <Descriptions.Item label="驳回原因" span={2}>
                  <Typography.Paragraph style={{ margin: 0 }}>
                    {selectedItem.reject_reason}
                  </Typography.Paragraph>
                </Descriptions.Item>
              )}
            </Descriptions>
            {mode === 'receive' && (
              <div style={{ marginTop: 24 }}>
                <Typography.Title level={5} style={{ marginBottom: 16 }}>
                  审核操作
                </Typography.Title>
                
                <Input.TextArea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="请输入驳回理由（驳回时必填）"
                  rows={3}
                  style={{ marginBottom: 16 }}
                />

                <Space>
                  <Button 
                    type="primary"
                    onClick={() => handleReview(selectedItem.id, true)}
                  >
                    通过申请
                  </Button>
                  <Button 
                    danger
                    onClick={() => handleReview(selectedItem.id, false)}
                  >
                    驳回申请
                  </Button>
                </Space>
              </div>
            )}
          </Card>
        ) : (
          <Empty description="请选择左侧的反馈查看详情" />
        )}
      </Col>
    </Row>
  );
};

export default FeedbackList;