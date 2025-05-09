import { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, InputNumber, message, Spin } from 'antd';
import type { DrawerProps } from 'antd';

import { PlusOutlined, EditOutlined } from '@ant-design/icons';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { request } from '../utils/network';

// "session": "lox53dvn9k6vma13vkmn4feuvi5vepun",
// "mid": 3,
// "name": "100米",
// "xingbie":"男子",
// "zubie":"甲组",
// "leixing":"决赛",
// "new_name": "200米决赛",
// "new_xingbie":"男子",
// "new_zubie":"甲组",
// "new_leixing":"决赛",
interface ProjectChangeRequest {
  session: string;
  mid: number;
  name: string;
  xingbie: string;
  zubie: string;
  leixing: string;
  new_name?: string;
  new_xingbie?: string;
  new_zubie?: string;
  new_leixing?: string;
}

interface ProjectChangeResponse {
	code: number;
	info: string;
}

interface EntryFormValues {
  mid: number;
  meet: string;

  name: string;
  xingbie: string;
  zubie: string;
  leixing: string;

  new_name?: string;
  new_xingbie?: string;
  new_zubie?: string;
  new_leixing?: string;
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

const ProjectEditForm = ({
  buttonStyle,
  defaultValues,
  isEditMode = false, // 新建条目 / 编辑条目
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
    };
    try {
      const data: ProjectChangeResponse = await request(
        `/api/manage_project`, 
        isEditMode ? 'PUT' : 'POST', 
        {
          ...cleanedValues, 
          session, 
        } as ProjectChangeRequest, 
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
        {isEditMode ? '编辑' : '新建比赛项目'}
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
              name="name"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="例：跳高" disabled={frozenItems.includes("projectname")}/>
            </Form.Item>

            <Form.Item
              label="项目类型"
              name="leixing"
              rules={[{ required: true, message: '请输入项目类型' }]}
            >
              <Input placeholder="例：决赛" disabled={frozenItems.includes("leixing")}/>
            </Form.Item>

            <Form.Item
              label="组别"
              name="zubie"
              rules={[{ required: true, message: '请输入组别' }]}
            >
              <Input placeholder="例：甲组" disabled={frozenItems.includes("zubie")}/>
            </Form.Item>

            <Form.Item
              label="性别"
              name="xingbie"
              rules={[{ required: true, message: '请输入性别' }]}
            >
              <Input placeholder="例：男子/女子/混合" disabled={frozenItems.includes("xingbie")}/>
            </Form.Item>

            {isEditMode && <>
            <Form.Item
              label="新项目名称"
              name="new_name"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="例：跳高" disabled={frozenItems.includes("new_name")}/>
            </Form.Item>

            <Form.Item
              label="新项目类型"
              name="new_leixing"
              rules={[{ required: true, message: '请输入项目类型' }]}
            >
              <Input placeholder="例：决赛" disabled={frozenItems.includes("new_leixing")}/>
            </Form.Item>

            <Form.Item
              label="新组别"
              name="new_zubie"
              rules={[{ required: true, message: '请输入组别' }]}
            >
              <Input placeholder="例：甲组" disabled={frozenItems.includes("new_zubie")}/>
            </Form.Item>

            <Form.Item
              label="新性别"
              name="new_xingbie"
              rules={[{ required: true, message: '请输入性别' }]}
            >
              <Input placeholder="例：男子/女子/混合" disabled={frozenItems.includes("new_xingbie")}/>
            </Form.Item>
            </>}
          </Form>
        </Spin>
      </Drawer>
    </>
  );
};

export default ProjectEditForm;