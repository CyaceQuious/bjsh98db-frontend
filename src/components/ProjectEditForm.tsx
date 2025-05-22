import { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, message, Spin } from 'antd';
import type { DrawerProps } from 'antd';

import { PlusOutlined, EditOutlined } from '@ant-design/icons';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { request } from '../utils/network';

import { filterByType } from '../utils/types';

interface ProjectChangeRequest {
  session: string;
  mid?: number; // 创建时提供
  id?: number; // 更新时提供
  name: string;
  xingbie: string;
  zubie: string;
  leixing: string;
}

interface ProjectChangeResponse {
	code: number;
	info: string;
}

interface EntryFormValues {
  meet: string;

  name?: string;
  xingbie?: string;
  zubie?: string;
  leixing?: string;
}

interface InfoId {
  // 用来传递提交给后端的时候需要用的id
  mid?: number; // 创建时提供
  id?: number; // 更新时提供
}

interface EntryFormDrawerProps {
  buttonStyle?: React.CSSProperties; // 触发按钮的样式
  defaultValues: EntryFormValues; // 表单默认值
  infoIds: InfoId;
  isEditMode?: boolean; // 操作模式：新建(false) 或 更新(true)
  useGray?: boolean; // 是否使用灰色按钮
  frozenItems: string[]; 
  onSuccess?: (values: ProjectChangeRequest) => void; // 提交成功回调
}

const ProjectEditForm = ({
  buttonStyle,
  defaultValues,
  infoIds,
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
    const cleanedValues: ProjectChangeRequest = {
      ...infoIds,
      session,
      name: values.name || defaultValues.name || "",
      xingbie: values.xingbie || defaultValues.xingbie || "",
      zubie: values.zubie || defaultValues.zubie || "",
      leixing: values.leixing || defaultValues.leixing || "",
    }
    const realRequest = filterByType<ProjectChangeRequest>(
      cleanedValues,
      ['session', 'mid', 'name', 'xingbie', 'zubie', 'leixing', 'id']
    )
    console.log('Real Request:', realRequest);
    try {
      const data: ProjectChangeResponse = await request(
        `/api/manage_project`, 
        isEditMode ? 'PUT' : 'POST', 
        realRequest, 
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
              <Input placeholder="例：跳高" disabled={frozenItems.includes("name")}/>
            </Form.Item>

            <Form.Item
              label="项目阶段"
              name="leixing"
              rules={[{ required: true, message: '请输入项目阶段' }]}
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
          </Form>
        </Spin>
      </Drawer>
    </>
  );
};

export default ProjectEditForm;