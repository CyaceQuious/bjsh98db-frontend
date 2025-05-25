import { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Spin } from 'antd';
import type { ModalProps } from 'antd';
const { TextArea } = Input;

import { MessageOutlined } from '@ant-design/icons';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { request } from '../utils/network';

import { filterByType } from '../utils/types';

interface FeedbackRequest {
  session: string;
  result_id: number;
  applyreason: string;
}

interface FeedbackResponse {
  code: number;
  info: string;
}

interface EntryFormValues {
  entryString: string;
  applyreason: string;
}

interface InfoId {
  // 用来传递提交给后端的时候需要用的id
  result_id: number;
}

interface EntryFormDrawerProps {
  buttonStyle?: React.CSSProperties; // 触发按钮的样式
  defaultValues: EntryFormValues; // 表单默认值
  infoIds: InfoId;
  useGray?: boolean; // 是否使用灰色按钮
  frozenItems: string[]; 
  onSuccess?: (values: FeedbackRequest) => void; // 提交成功回调
}

const FeedbackApplicationForm = ({
  buttonStyle,
  defaultValues,
  infoIds,
  useGray = false, 
  frozenItems = [], 
  onSuccess
}: EntryFormDrawerProps) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerProps, setDrawerProps] = useState<ModalProps>({
    title: '提交成绩反馈',
    width: 700
  });
  const session = useSelector((state: RootState) => state.auth.session);

  // 初始化表单值
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(defaultValues || {});
      setDrawerProps(prev => ({
        ...prev,
        title: '提交成绩反馈',
      }));
    }
  }, [open, form, defaultValues]);

  // 提交处理
  const handleSubmit = async (values: EntryFormValues) => {
    setLoading(true);
    console.log('Form Values:', values);
    const cleanedValues: FeedbackRequest = {
      ...infoIds,
      session,
      applyreason: values.applyreason,
    }
    const realRequest = filterByType<FeedbackRequest>(
      cleanedValues,
      ['session', 'applyreason', 'result_id']
    )
    console.log('Real Request:', realRequest);
    try {
      const data: FeedbackResponse = await request(
        `/api/result_message/feedback`, 
        'POST', 
        realRequest, 
        false, 
        'json',
      );
      if (data.code !== 0) {
        alert(data.info || 'Failed to submit feedback');
      }
      message.success('申请提交成功');
      setOpen(false);
      onSuccess?.(cleanedValues);
    } catch (err) {
      message.warning('操作失败，请重试: ' + err);
      console.log('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  console.log(`frozen items: ${frozenItems}`)

  return (
    <>
      <Button
        variant='outlined'
        color='green'
        style={!useGray ? buttonStyle :
          {
            ...buttonStyle,
            color: '#8c8c8c',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          }
        }
        onClick={() => setOpen(true)}
        icon={<MessageOutlined/>}
      >
        {'反馈'}
      </Button>

      <Modal
        {...drawerProps}
        open={open}
        onClose={() => setOpen(false)}
		onCancel={() => setOpen(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button 
              type="primary" 
              onClick={() => form.submit()}
              loading={loading}
            >
              {'提交'}
            </Button>
          </div>
        }
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={defaultValues}
          >
            <Form.Item
              label="反馈成绩"
              name="entryString"
              rules={[{ required: true, message: '请输入修改成绩' }]}
            >
              <TextArea disabled autoSize={{ maxRows: 2 }}/>
            </Form.Item>

            <Form.Item
              label="申请内容与理由"
              name="applyreason"
              rules={[{ required: true, message: '请输入申请理由，不超过300个字符' }]}
            >
              <TextArea placeholder="请输入申请理由，不超过300个字符" disabled={frozenItems.includes("applyreason")} autoSize={{ minRows: 4, maxRows: 10 }}/>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default FeedbackApplicationForm;