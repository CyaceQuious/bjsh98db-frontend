import { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, InputNumber, message, Spin } from 'antd';
import type { DrawerProps } from 'antd';

import { PlusOutlined, EditOutlined } from '@ant-design/icons';

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
  meet: string;
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
  meet: string;
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
  useGray?: boolean;
  frozenItems: string[]; 
  // 提交成功回调
  onSuccess?: (values: EntryFormValues) => void;
}

const ResultEditForm = ({
  buttonStyle,
  defaultValues,
  isEditMode = false,
  useGray = false, 
  frozenItems = [], 
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
    const cleanedValues = {
      ...defaultValues, 
      ...values, 
      rank: values.rank ?? undefined,
      score: values.score ?? undefined
    };
    try {
      const data: ResultChangeResponse = await request(
      `/api/manage_result`, 
      isEditMode ? 'PUT' : 'POST', 
      {
        ...cleanedValues, 
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
        type={isEditMode ? 'link' : 'primary'}
        style={!useGray ? buttonStyle :
          {
            ...buttonStyle,
            color: '#8c8c8c',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          }
        }
        onClick={() => setOpen(true)}
        icon={isEditMode ? <EditOutlined/>: <PlusOutlined/>}
      >
        {isEditMode ? '编辑' : '新建比赛成绩'}
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
              label="赛事名称"
              name="meet"
              rules={[{ required: true, message: '赛事名称' }]}
            >
              <Input placeholder="例：某某小马杯，但是要全称" disabled={frozenItems.includes("meet")}/>
            </Form.Item>

            <Form.Item
              label="项目名称"
              name="projectname"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="例：男子跳高" disabled={frozenItems.includes("projectname")}/>
            </Form.Item>

            <Form.Item
              label="参赛者姓名"
              name="name"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="例：张三" disabled={frozenItems.includes("name")}/>
            </Form.Item>

            <Form.Item
              label="所属团体"
              name="groupname"
              rules={[{ required: true, message: '请输入团体名称' }]}
            >
              <Input placeholder="例：电子系" disabled={frozenItems.includes("groupname")}/>
            </Form.Item>

            <Form.Item
              label="比赛结果"
              name="result"
              rules={[{ required: true, message: '请输入比赛结果' }]}
            >
              <Input placeholder="例：1.95m" disabled={frozenItems.includes("result")}/>
            </Form.Item>

            <Form.Item
              label="排名"
              name="rank"
              rules={[{ required: false, message: '请输入排名' }]}
            >
              <InputNumber min={1} disabled={frozenItems.includes("rank")}/>
            </Form.Item>

            <Form.Item
              label="得分"
              name="score"
              rules={[{ required: false, message: '请输入得分' }]}
            >
              <InputNumber step={0.1} disabled={frozenItems.includes("score")}/>
            </Form.Item>
          </Form>
        </Spin>
      </Drawer>
    </>
  );
};

export default ResultEditForm;