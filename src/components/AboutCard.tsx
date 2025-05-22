import { Typography, Alert, List, theme } from 'antd';
// import styles from '../styles/container.module.css';
import Link from 'next/link';
import Card from 'antd/es/card/Card';

const { Title, Text } = Typography;
// const { Content } = Layout;
const { useToken } = theme;

import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface WebsiteFunctionDataType {
  name: string;
  content: string; 
}

const columnsWebsiteFunction: TableProps<WebsiteFunctionDataType>['columns'] = [
  {
    title: '功能名称',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
	title: '功能描述', 
	dataIndex: 'content', 
	key: 'content', 
	render: (text) => <a>{text}</a>
  }
]

const websetFunctions: WebsiteFunctionDataType[] = [
	{
		name: 'Query（检索）', 
		content: '根据关键字（目前计划支持的关键字有：姓名、代表队（一般是院系）、比赛、项目、名次（仅检索前8 / 不限制））检索成绩。可以开启模糊搜索。'
	}, 
	{
		name: 'QueryGroup（团体总分）', 
		content: '先显示比赛列表，点击比赛进入比赛主页，显示各院系团体总分，点击院系可显示得分详情。团体总分基于成绩条目实时更新。'
	}, 
	{
		name: 'QueryMy（检索关注）', 
		content: '显示我关注的比赛/选手。'
	}, 
	{
		name: 'ModifyMy（修改关注）', 
		content: '显示我的用户主页，并可以修改关注的比赛/选手。'
	}, 
	{
		name: 'ModifyEntry（修改条目）', 
		content: '比赛官员可以修改相应比赛的成绩。比赛官员将该比赛成绩表与原查询页同步。只会拉取平台没有，原查询页有的数据。'
	}, 
	{
		name: 'ModifyList（修改比赛列表）', 
		content: '系统管理员修改比赛列表。系统管理员将比赛列表与原查询页同步。'
	}, 
	{
		name: 'AthletePage（选手主页）', 
		content: '包含该选手历史成绩，PB（Personal Best）等。个人可修改部分。'
	}, 
	{
		name: 'Register（注册）', 
		content: '提供包括用户名、密码在内的注册信息。'
	}, 
	{
		name: 'Login（登录）', 
		content: '-'
	}, 
	{
		name: 'ApplyAuth（申请实名认证）', 
		content: '注册用户给出实名和所属体干，由该体干审核，认证后选手主页显示更多（用户的）信息。'
	}, 
	{
		name: 'Authenticate（审核实名认证）', 
		content: '体干收到申请后进行审核。'
	}, 
	{
		name: 'Authenticate（审核实名认证）', 
		content: '体干收到申请后进行审核。'
	}, 
	{
		name: 'ModifyUserStatus（修改用户权限）', 
		content: '系统管理员可以“任免”比赛官员/体干。'
	}, 
	{
		name: 'Comment（评论）', 
		content: '在比赛主页中，用户可以评论。'
	}, 
	{
		name: 'Feedback（成绩反馈）', 
		content: '体干针对追诉期内的成绩进行反馈，除文本外，可以提交相应证明文件，由相应比赛官员审核。'
	}, 
	{
		name: 'ReplyFdbk（回复反馈）', 
		content: '比赛官员在修正/检查受反馈成绩后，可以对反馈进行回复。'
	}
]; 

const Developers = [
	{ name: 'ryz', link: '/' , other: ''},
	{ name: 'czy', link: '/' , other: ''},
	{ name: 'zjy', link: '/' , other: ''},
	{ name: 'fgf', link: '/' , other: ''},
	{ name: 'mpc', link: '/' , other: ''}
]

interface AboutCardProps {
	mode: "simple" | "full"; 
}

const AboutCard = ({mode}: AboutCardProps) => {
    const { token } = useToken();

    return (
        // <Card className={styles.container} style={{ padding: token.paddingLG }}>
            <div style={{ 
				marginBottom: token.marginLG,
                // maxWidth: "90%", 
                // margin: '0 auto',
                // padding: token.paddingLG,
                // background: token.colorBgContainer,
                // borderRadius: token.borderRadiusLG,
                // boxShadow: token.boxShadow
            }}>
				{mode === "full" ? 
                <Title
                    level={2}
                    style={{
                        textAlign: 'center',
                        marginBottom: token.marginLG,
                    }}
                >
                    关于数据平台
                </Title>
				: "" }
                
                <Card title="项目介绍" style={{marginBottom: token.marginLG}}>
                bjsh98.db（大体协数据库）是一个为北京市大学生体育协会（简称“大体协”）成绩查询页开发的数据检索平台，借助于信息化技术，尤其是软件技术和互联网技术，支持赛会组织方、运动员、观众等群体高效、安全地上传、修正、查询相关赛事成绩数据，优化落后的查询模式。
                </Card>

				{mode === "full" ? 
                <Card title="网站功能"  style={{marginBottom: token.marginLG}} >
					<Table<WebsiteFunctionDataType> columns={columnsWebsiteFunction} dataSource={websetFunctions} />
				</Card>
				: "" }

				{mode === "full" ? 
                <Card title="开发者"  style={{marginBottom: token.marginLG}} >
                    <List
                        grid={{ gutter: 16, column: 2 }}
                        dataSource={Developers}
                        renderItem={(item) => (
                            <List.Item style={{ margin: 0 }}>
                                <Link 
                                    href={item.link} 
                                    style={{
                                        color: token.colorPrimary,
                                        transition: 'color 0.3s',
                                    }}
                                >
                                    {item.name}
                                </Link>
                                <Text>
                                    {item.other}
                                </Text>
                            </List.Item>
                        )}
                    />
                </Card>
				: "" }

                <Alert
                    message="数据声明"
                    description={
                        <Text style={{ color: token.colorTextSecondary }}>
                            原始数据来源：
                            <Link href="https://wx.bjsh98.com/client/index.html">
                                bjsh98官方平台
                            </Link>
                        </Text>
                    }
                    type="info"
                    showIcon
                />
            </div>
        // </Card>
    );
};

export default AboutCard;