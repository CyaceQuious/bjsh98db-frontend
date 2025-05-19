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
  Alert,
} from "antd";

const { Title } = Typography;
const { Option } = Select;

interface Contest {
  name: string;
  mid: number;
}

interface UserStatus {
  username: string;
  Is_Department_Official: boolean;
  Is_Contest_Official: number[];
  Is_System_Admin: boolean;
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
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | "info" | "warning" | undefined;
    message: string;
  }>({ type: undefined, message: "" });
  const [fetchingStatus, setFetchingStatus] = useState(false);

  // 获取比赛列表
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setContestsLoading(true);
        const response = await fetch("/api/query_meet_list");
        const result = await response.json();

        if (result.code === 0 && result.results) {
          setContests(result.results);
        } else {
          message.error(`获取比赛列表失败: ${result.info}`);
          setSubmitStatus({
            type: "error",
            message: `获取比赛列表失败: ${result.info}`,
          });
        }
      } catch (error) {
        console.error("获取比赛列表失败:", error);
        message.error("获取比赛列表失败，请检查网络连接");
        setSubmitStatus({
          type: "error",
          message: "获取比赛列表失败，请检查网络连接",
        });
      } finally {
        setContestsLoading(false);
      }
    };

    fetchContests();
  }, []);

  // 检查权限（放入 useEffect，避免 SSR 阶段触发）
  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  // 获取用户当前权限状态
  // ... (previous imports remain the same)

  // 获取用户当前权限状态
  const fetchUserStatus = async (username: string) => {
    if (!username) return;
    
    setFetchingStatus(true);
    try {
      const response = await fetch(`/api/users/get_user_status?username=${encodeURIComponent(username)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.code === 0 && result.data) {
        const userStatus: UserStatus = {
          username: result.data.username,
          Is_Department_Official: result.data.Is_Department_Official,
          Is_Contest_Official: result.data.Is_Contest_Official || [],
          Is_System_Admin: result.data.Is_System_Admin,
        };
        
        form.setFieldsValue({
          user_to_modify: userStatus.username,
          Is_Department_Official: userStatus.Is_Department_Official,
          Is_System_Admin: userStatus.Is_System_Admin,
          Is_Contest_Official: userStatus.Is_Contest_Official,
        });
      } else {
        message.warning(`获取用户权限失败: ${result.info}`);
        // 如果用户不存在，清空表单
        form.setFieldsValue({
          Is_Department_Official: false,
          Is_System_Admin: false,
          Is_Contest_Official: [],
        });
      }
    } catch (error) {
      console.error("获取用户权限失败:", error);
      message.error("获取用户权限失败，请检查网络连接");
    } finally {
      setFetchingStatus(false);
    }
  };

// ... (rest of the code remains the same)

  // 用户名输入框失去焦点时获取用户权限
  const handleUsernameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const username = e.target.value.trim();
    if (username) {
      await fetchUserStatus(username);
    }
  };

  // SSR 阶段避免渲染
  if (!isAdmin) {
    return undefined;
  }

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setSubmitStatus({ type: undefined, message: "" });

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
          formData.append("Is_Contest_Official", id.toString());
        });
      }

      const response = await fetch("/api/users/modify_user_status", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.code === 0) {
        message.success("用户权限修改成功");
        setSubmitStatus({
          type: "success",
          message: `成功修改用户 ${values.user_to_modify} 的权限`,
        });
      } else {
        message.error(`操作失败: ${result.info}`);
        setSubmitStatus({
          type: "error",
          message: `操作失败: ${result.info}`,
        });
      }
    } catch (error) {
      console.error("请求失败:", error);
      let errorMessage = "操作失败，请重试";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (contestsLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "100px" }}
      >
        <Spin size="large" tip="加载比赛列表中..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Card>
        <Title level={3} style={{ marginBottom: "24px" }}>
          用户权限管理
        </Title>

        {submitStatus.type && (
          <Alert
            type={submitStatus.type}
            message={submitStatus.message}
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="用户名"
            name="user_to_modify"
            rules={[
              { required: true, message: "请输入用户名" },
            ]}
          >
            <Input 
              placeholder="输入要修改权限的用户名" 
              onBlur={handleUsernameBlur}
              disabled={fetchingStatus}
              suffix={fetchingStatus ? <Spin size="small" /> : null}
            />
          </Form.Item>

          <Form.Item
            label="体干"
            name="Is_Department_Official"
            valuePropName="checked"
            tooltip="授予用户体干权限"
          >
            <Switch disabled={fetchingStatus} />
          </Form.Item>

          <Form.Item
            label="系统管理员"
            name="Is_System_Admin"
            valuePropName="checked"
            tooltip="授予用户系统管理员权限"
          >
            <Switch disabled={fetchingStatus} />
          </Form.Item>

          <Form.Item
            label="比赛官员权限"
            name="Is_Contest_Official"
            tooltip="选择用户可以管理的比赛"
          >
            <Select
              mode="multiple"
              placeholder="选择可管理的比赛"
              optionFilterProp="children"
              style={{ width: "100%" }}
              loading={contestsLoading || fetchingStatus}
              disabled={contestsLoading || fetchingStatus}
              notFoundContent={
                contestsLoading ? <Spin size="small" /> : "无比赛数据"
              }
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
              disabled={contestsLoading || fetchingStatus}
            >
              {loading ? "处理中..." : "修改权限"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}