import { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, InputNumber, message, Spin } from 'antd';
import type { DrawerProps } from 'antd';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { request } from '../utils/network';

// "session": "lox53dvn9k6vma13vkmn4feuvi5vepun",
// "mid": 3,
// "projectname": "男子跳高",
// "name": "张三",
// "groupname": "电子系",
// "result": "1.95m",
// "rank": 1,
// "score": 9.0
interface ResultChangeRequest {
  session: string;
  mid: number;
  projectname: string;
  name: string;
  groupname: string;
  result: string;
  rank?: number;
  score?: number;
}

interface ResultChangeResponse {
	code: number;
	info: string;
}

interface EntryFormValues {
  mid: number;
  projectname: string;
  name: string;
  groupname: string;
  result: string;
  rank?: number;
  score?: number;
}

interface EntryFormDrawerProps {
  // 触发按钮的样式
  buttonStyle?: React.CSSProperties;
  // 表单默认值
  defaultValues?: Partial<EntryFormValues>;
  // 操作模式：新建(false) 或 更新(true)
  isEditMode?: boolean;
  // 提交成功回调
  onSuccess?: (values: EntryFormValues) => void;
}

const ResultEditForm = ({
  buttonStyle,
  defaultValues,
  isEditMode = false,
  onSuccess
}: EntryFormDrawerProps) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerProps, setDrawerProps] = useState<DrawerProps>({
    title: '新建条目',
    width: 500
  });
  const session = useSelector((state: RootState) => state.auth.session);

  // 初始化表单值
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(defaultValues || {});
      setDrawerProps(prev => ({
        ...prev,
        title: isEditMode ? '编辑条目' : '新建条目'
      }));
    }
  }, [open, form, defaultValues, isEditMode]);

  // 提交处理
  const handleSubmit = async (values: EntryFormValues) => {
    setLoading(true);
    console.log('Form Values:', values);
    if (values.rank === null) {values.rank = undefined; }
    if (values.score === null) {values.score = undefined; }
    try {
      const data: ResultChangeResponse = await request(
      `/api/manege_result`, 
      isEditMode ? 'PUT' : 'POST', 
      {
        ...values, 
        session, 
      } as ResultChangeRequest, 
      false, 
      'json'
      );
      if (data.code !== 0) {
        alert(data.info || 'Failed to change result');
      }
      message.success(isEditMode ? '更新成功' : '创建成功');
      setOpen(false);
      onSuccess?.(values);
    } catch (err) {
      message.error('操作失败，请重试');
      console.log('API Error:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <Button
        type={isEditMode ? 'link' : 'primary'}
        style={buttonStyle}
        onClick={() => setOpen(true)}
      >
        {isEditMode ? '编辑' : '+ 新建条目'}
      </Button>

      <Drawer
        {...drawerProps}
        open={open}
        onClose={() => setOpen(false)}
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
              {isEditMode ? '更新' : '创建'}
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
              label="赛事编号"
              name="mid"
              rules={[{ required: true, message: '赛事编号' }]}
            >
              <Input placeholder="例：203" disabled/>
            </Form.Item>

            <Form.Item
              label="项目名称"
              name="projectname"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="例：男子跳高" />
            </Form.Item>

            <Form.Item
              label="参赛者姓名"
              name="name"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="例：张三" />
            </Form.Item>

            <Form.Item
              label="所属团体"
              name="groupname"
              rules={[{ required: true, message: '请输入团体名称' }]}
            >
              <Input placeholder="例：电子系" />
            </Form.Item>

            <Form.Item
              label="比赛结果"
              name="result"
              rules={[{ required: true, message: '请输入比赛结果' }]}
            >
              <Input placeholder="例：1.95m" />
            </Form.Item>

            <Form.Item
              label="排名"
              name="rank"
              rules={[{ required: false, message: '请输入排名' }]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item
              label="得分"
              name="score"
              rules={[{ required: false, message: '请输入得分' }]}
            >
              <InputNumber step={0.1} />
            </Form.Item>
          </Form>
        </Spin>
      </Drawer>
    </>
  );
};

export default ResultEditForm;