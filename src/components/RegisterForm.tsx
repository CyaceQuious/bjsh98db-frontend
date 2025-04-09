// 注册账号的组件
// 用于/register

import { request } from "../utils/network";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

import store from "../redux/store";

import useRouteHistory from "../hook/useRouteHistroy";

import { checkUserName, checkPassword } from "../utils/auth";
import { LoginRequest, LoginResponse } from "../utils/types";

import { interfaceToString } from "../utils/types";

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Row, Col, Card, Space, Typography } from 'antd';
import { FormRule } from 'antd';

const { Title, Text } = Typography;

export default function RegisterForm() {
    const { canGoBack } = useRouteHistory();
    const router = useRouter();
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
                validator: (_: FormRule, value: string) =>
                    checkUserName(value)
                        ? Promise.resolve()
                        : Promise.reject('用户名只能包含字母、数字和下划线')
            }
        ],
        password: [
            { required: true, message: '请输入密码' },
            {
                validator: (_: FormRule, value: string) =>
                    checkPassword(value)
                        ? Promise.resolve()
                        : Promise.reject('密码只能包含字母、数字和下划线')
            }
        ],
        password2: [
            { required: true, message: '请再次输入密码' },
            {
                validator: (_: FormRule, value: string) =>
                    checkPassword(value)
                        ? Promise.resolve()
                        : Promise.reject('密码只能包含字母、数字和下划线')
            },
            ({ getFieldValue }: { getFieldValue: (name: string) => any }) => ({
                validator(_: FormRule, value: string) {
                    const password = getFieldValue('password');
                    if (!value || password === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                }
            }),
        ]
    };

    // 提交注册信息
    const handleRegister = async (values: { username: string; password: string }) => {
        setLoading(true);
        console.log(values)
        request(
            `/api/users/register`,
            'POST',
            interfaceToString({ username: values.username, password: values.password } as LoginRequest),
            false
        ).then((res) => {
            return res.data;
        }).then((res: LoginResponse) => {
            console.log(res);
            setModalContent(`用户 ${res.username} 注册成功`);
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
    
    // 注册完成后跳转框的处理
    const handleConfirm = (type?: 'login' | 'home') => {
        setModalVisible(false);
        if (type === 'login') {
            router.push('/login');
        } else {
            router.push("/");
        }
    };
    const jumpLogin = () => {
        router.push("/login")
    }
    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col xs={20} sm={16} md={12} lg={8}>
                <Card variant={"borderless"} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    <Title level={3} style={{ textAlign: 'center', marginBottom: 40 }}>
                        用户注册
                    </Title>

                    <Form
                        form={form}
                        onFinish={handleRegister}
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

                        <Form.Item name="password2" rules={validationRules.password2} dependencies={['password']}>
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="重复密码"
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
                                注册
                            </Button>
                        </Form.Item>

                        <Space style={{ width: '100%', justifyContent: 'center' }}>
                            <Text>
                                已有帐号？立即
                            </Text>
                            <Button type="link" onClick={jumpLogin}>
                                登录
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
                                        onClick={() => handleConfirm('login')}
                                    >
                                        立即登录
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
                </Modal>
            </Col>
        </Row>
    );
}