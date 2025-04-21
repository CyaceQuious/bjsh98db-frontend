import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  message,
  Typography,
  Select,
  Spin,
} from "antd";

const { Title } = Typography;
const { Option } = Select;

interface Contest {
  name: string;
  mid: number;
}

interface ModifyUserParams {
  session: string;
  user_to_modify: string;
  Is_Department_Official: boolean;
  Is_Contest_Official: number[];
  Is_System_Admin: boolean;
}

export default function UserManagement() {
  const router = useRouter();
  const session = useSelector((state: RootState) => state.auth.session);
  const isAdmin = useSelector((state: RootState) => state.auth.isSystemAdmin);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [contests, setContests] = useState<Contest[]>([]);
  const [contestsLoading, setContestsLoading] = useState(true);

  // 获取比赛列表
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch("/api/query_meet_list");
        const result = await response.json();

        if (result.code === 0 && result.results) {
          setContests(result.results);
        } else {
          message.error(`获取比赛列表失败: ${result.info}`);
        }
      } catch (error) {
        message.error("获取比赛列表失败，请检查网络连接");
      } finally {
        setContestsLoading(false);
      }
    };

    fetchContests();
  }, []);

  // 检查权限
  if (!isAdmin) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      // 基础参数
      formData.append("session", session);
      formData.append("user_to_modify", values.user_to_modify);
      formData.append(
        "Is_Department_Official",
        values.Is_Department_Official ? "True" : "False"
      );
      formData.append(
        "Is_System_Admin",
        values.Is_System_Admin ? "True" : "False"
      );

      // 处理比赛ID数组（不带[]后缀）
      const contestIds = values.Is_Contest_Official || [];
      if (contestIds.length > 0) {
        contestIds.forEach((id: number) => {
          formData.append("Is_Contest_Official", id.toString()); // 关键修改点
        });
      }

      // 打印实际请求体（调试用）
      console.log("最终请求体:", formData.toString());

      const response = await fetch("/api/users/modify_user_status", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      try {
        const text = await response.clone().text();
        console.log("Body (raw):", text);
        console.log("Body (parsed):", JSON.parse(text));
      } catch (e) {
        console.error("响应解析错误:", e);
      }
      console.groupEnd();

      if (!response.ok) {
        throw new Error(`HTTP 错误! 状态码: ${response.status}`);
      }

      const result = await response.json();
      // ...处理业务逻辑...
    } catch (error) {
      console.error("请求失败:", error);
      if (error instanceof Error) {
        message.error(`操作失败: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (contestsLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "100px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Card>
        <Title level={3} style={{ marginBottom: "24px" }}>
          用户权限管理
        </Title>

        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="用户名"
            name="user_to_modify"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="输入要修改权限的用户名" />
          </Form.Item>

          <Form.Item
            label="部门管理员"
            name="Is_Department_Official"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="系统管理员"
            name="Is_System_Admin"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="比赛管理员权限" name="Is_Contest_Official">
            <Select
              mode="multiple"
              placeholder="选择可管理的比赛"
              optionFilterProp="children"
              style={{ width: "100%" }}
              loading={contestsLoading}
            >
              {contests.map((contest) => (
                <Option key={contest.mid} value={contest.mid}>
                  {contest.name} (ID: {contest.mid})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              修改权限
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
