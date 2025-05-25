import { useState, useEffect } from 'react';
import { Button, Form, Input, InputNumber, message, Spin, Row, Col, Space, Card} from 'antd';

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { request } from '../utils/network';

import { filterByType } from '../utils/types';

interface ResultChangeRequest {
  session: string;
  resultid: number;
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

interface EntryFormProps {
  defaultValues: Partial<EntryFormValues>; // 表单默认值
  infoIds: Partial<InfoId>;
  isEditMode?: boolean; // 操作模式：新建(false) 或 更新(true)
  frozenItems: string[]; 
  onSuccess?: (values: EntryFormValues) => void; // 提交成功回调
}

const ResultEditForm = ({
  defaultValues,
  infoIds,
  frozenItems = [], 
  onSuccess
}: EntryFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const session = useSelector((state: RootState) => state.auth.session);

  // 初始化表单值
  useEffect(() => {
      form.resetFields();
      form.setFieldsValue(defaultValues || {}); 
  }, [form, defaultValues]);

  // 处理重置
  const handleReset = () => {
    form.resetFields();
	form.setFieldsValue(defaultValues || {});
  }

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
      ['session', 'resultid', 'name', 'groupname', 'result', 'rank', 'score']
    );
    try {
      const data: ResultChangeResponse = await request(
      `/api/manage_result`, 
      'PUT', 
      realRequest, 
      false, 
      'json'
      );
      if (data.code !== 0) {
        alert(data.info || 'Failed to change result');
      }
      message.success('更新成绩成功');
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
      <Card title={"修改成绩"} style={{marginTop: "16px"}}>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={defaultValues}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="参赛者姓名"
                  name="name"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input placeholder="例：张三" disabled={frozenItems.includes("name")}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="所属团体"
                  name="groupname"
                  rules={[{ required: true, message: '请输入团体名称' }]}
                >
                  <Input placeholder="例：电子系" disabled={frozenItems.includes("groupname")}/>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="比赛结果"
                  name="result"
                  rules={[{ required: true, message: '请输入比赛结果' }]}
                >
                  <Input placeholder="例：1.95m" disabled={frozenItems.includes("result")}/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="排名"
                  name="rank"
                  rules={[{ required: false, message: '请输入排名' }]}
                  getValueFromEvent={(value) => typeof value !== 'number' ? undefined : value}
                >
                  <InputNumber min={1} disabled={frozenItems.includes("rank")} style={{ width: '100%' }}/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="得分"
                  name="score"
                  rules={[{ required: false, message: '请输入得分' }]}
                  getValueFromEvent={(value) => typeof value !== 'number' ? undefined : value}
                >
                  <InputNumber step={0.1} disabled={frozenItems.includes("score")} style={{ width: '100%' }}/>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
              <Space>
                <Button 
                  type="primary" 
                  onClick={() => form.submit()}
                  loading={loading}
                >
                  {'更新成绩'}
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </>
  );
};

export default ResultEditForm;