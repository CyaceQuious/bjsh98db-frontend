import { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, InputNumber, message, Spin } from 'antd';
import type { DrawerProps } from 'antd';

import { PlusOutlined, EditOutlined } from '@ant-design/icons';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { request } from '../utils/network';

import { filterByType } from '../utils/types';

interface ResultChangeRequest {
  session: string;
  // 以下创建时提供
  projectid?: number; 
  commit?: string; // 强制创建
  // 以下更新时提供
  resultid?: number;
  // 以下是成绩属性
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
  // 以下项目基本都是冻结项（但是还是以调用者为准）
  meet: string;
  projectname: string;
  xingbie: string;
  zubie: string;
  leixing: string;
  // 以下项目可以修改
  name: string;
  groupname: string;
  result: string;
  rank?: number;
  score?: number;
}

interface InfoId {
  // 用来传递提交给后端的时候需要用的id
  projectid?: number;
  resultid?: number;
}

interface EntryFormDrawerProps {
  buttonStyle?: React.CSSProperties; // 触发按钮的样式
  defaultValues: Partial<EntryFormValues>; // 表单默认值
  infoIds: Partial<InfoId>;
  isEditMode?: boolean; // 操作模式：新建(false) 或 更新(true)
  useGray?: boolean; // 是否使用灰色按钮
  frozenItems: string[]; 
  onSuccess?: (values: EntryFormValues) => void; // 提交成功回调
}

const ResultEditForm = ({
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
  const handleSubmit = async (values: EntryFormValues, commit: string = "False") => {
    setLoading(true);
    console.log('Form Values:', values);
    const cleanedValues = {
      ...defaultValues,
      ...infoIds,
      ...values,
      rank: !isNaN(+(values.rank??"-")) ? +(values.rank??"") : undefined,
      score: !isNaN(+(values.score??"-")) ? +(values.score??"") : undefined,
      session,
      commit,
    };
    console.log('Cleaned Values:', cleanedValues);
    const realRequest = filterByType<ResultChangeRequest>(
      cleanedValues,
      ['session', 'commit', 'projectid', 'resultid', 'name', 'groupname', 'result', 'rank', 'score']
    );
    try {
      const data: ResultChangeResponse = await request(
      `/api/manage_result`, 
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
              <Input placeholder="例：跳高" disabled={frozenItems.includes("projectname")}/>
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
              rules={[{ required: true, message: '请输入项目组别' }]}
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
              getValueFromEvent={(value) => {
                // 当 InputNumber 清空时，value 为 null，此处转换为 undefined
                return typeof value !== 'number' ? undefined : value;
              }}
            >
              <InputNumber min={1} disabled={frozenItems.includes("rank")}/>
            </Form.Item>

            <Form.Item
              label="得分"
              name="score"
              rules={[{ required: false, message: '请输入得分' }]}
              getValueFromEvent={(value) => {
                // 当 InputNumber 清空时，value 为 null，此处转换为 undefined
                return typeof value !== 'number' ? undefined : value;
              }}
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