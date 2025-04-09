// 登录的组件
// 用于/login

import { request } from "../utils/network";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

import store from "../redux/store";
import { useDispatch } from "react-redux";
import { setUserName, setSession, setCreateTime, setEmail, setRealName, setIsContestOfficial, setIsDepartmentOfficial, setIsSystemAdmin, setOrg } from "../redux/auth";

import useRouteHistory from "../hook/useRouteHistroy";

import { checkUserName, checkPassword } from "../utils/auth";
import { LoginRequest, LoginResponse } from "../utils/types";

import { interfaceToString } from "../utils/types";

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Row, Col, Card, Space, Typography } from 'antd';

const { Title } = Typography;

export default function LoginForm() {
    const { canGoBack } = useRouteHistory();
    const router = useRouter();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);

    // 如果已登录，强制跳转到登出界面
    useEffect(() => {
        if (store.getState().auth.userName !== "") {
            router.push("/logout");
        }
    }, [])

    // 表单验证规则
    const validationRules = {
        username: [
            { required: true, message: '请输入用户名' },
            {
                validator: (_: any, value: string) =>
                    checkUserName(value)
                        ? Promise.resolve()
                        : Promise.reject('用户名只能包含字母、数字和下划线')
            }
        ],
        password: [
            { required: true, message: '请输入密码' },
            {
                validator: (_: any, value: string) =>
                    checkPassword(value)
                        ? Promise.resolve()
                        : Promise.reject('密码只能包含字母、数字和下划线')
            }
        ]
    };

    const handleLogin = async (values: { username: string; password: string }) => {
        setLoading(true);
        console.log(values)
        request(
            `/api/users/login`,
            'POST',
            interfaceToString({ username: values.username, password: values.password } as LoginRequest),
            false
        ).then((res) => {
            return res.data;
        }).then((res: LoginResponse) => {
            console.log(res);
            dispatch(setUserName(res.username));
            dispatch(setSession(res.session));
            dispatch(setCreateTime(res.create_time));
            dispatch(setEmail(res.email));
            dispatch(setRealName(res.real_name));
            dispatch(setIsContestOfficial(res.Is_Contest_Official));
            dispatch(setIsDepartmentOfficial(res.Is_Department_Official));
            dispatch(setIsSystemAdmin(res.Is_System_Admin));
            dispatch(setOrg(res.org));

            setModalContent(`用户 ${res.username} 登录成功`);
            setIsLoginSuccess(true);
            setModalVisible(true);
        }).catch((err) => {
            setModalContent(`${err}`);
            setIsLoginSuccess(false);
            setModalVisible(true);
        }).finally(() => {
            setLoading(false);
        });
    }
    const [countdown, setCountdown] = useState(3);
    // 自动跳转倒计时
    useEffect(() => {
        if (isLoginSuccess && modalVisible) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        handleConfirm('back');
                        return 3;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isLoginSuccess, modalVisible]);
    const handleConfirm = (type?: 'back' | 'home') => {
        setModalVisible(false);
        if (type === 'back' && canGoBack) {
            router.back();
        } else {
            router.push("/");
        }
    };
    const jumpRegister = () => {
        router.push("/register")
    }
    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col xs={20} sm={16} md={12} lg={8}>
                <Card variant={"borderless"} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    <Title level={3} style={{ textAlign: 'center', marginBottom: 40 }}>
                        用户登录
                    </Title>

                    <Form
                        form={form}
                        onFinish={handleLogin}
                        initialValues={{ remember: true }}
                        size="large"
                    >
                        <Form.Item name="username" rules={validationRules.username}>
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="用户名"
                                allowClear
                            />
                        </Form.Item>

                        <Form.Item name="password" rules={validationRules.password}>
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="密码"
                                allowClear
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                            >
                                登录
                            </Button>
                        </Form.Item>

                        <Space style={{ width: '100%', justifyContent: 'center' }}>
                            <Button type="link" onClick={jumpRegister}>
                                立即注册
                            </Button>
                        </Space>
                    </Form>
                </Card>

                <Modal
                    title="系统提示"
                    open={modalVisible}
                    footer={[
                        isLoginSuccess && (
                            <Space key="actions">
                                {canGoBack && (
                                    <Button
                                        type="primary"
                                        onClick={() => handleConfirm('back')}
                                    >
                                        返回上一页
                                    </Button>
                                )}
                                <Button
                                    type="primary"
                                    onClick={() => handleConfirm('home')}
                                >
                                    前往首页
                                </Button>
                            </Space>
                        ),
                        !isLoginSuccess && (
                            <Button key="close" onClick={() => setModalVisible(false)}>
                                关闭
                            </Button>
                        )
                    ]}
                    onCancel={() => setModalVisible(false)}
                    closable={!isLoginSuccess} // 成功时禁用关闭按钮
                >
                    <p style={{ margin: 0, fontSize: 16 }}>{modalContent}</p>
                    {isLoginSuccess && (
                        <p style={{ margin: '10px 0 0', color: '#888' }}>
                            将在<span style={{ color: '#1890ff', fontWeight: 'bold' }}>{countdown}</span>
                            后自动跳转
                        </p>
                    )}
                </Modal>
            </Col>
        </Row>
    );
}