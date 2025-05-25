import { Typography, Alert, List, theme } from 'antd';
import Link from 'next/link';
import Card from 'antd/es/card/Card';
import React from 'react';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

const Developers = [
  { name: 'CyaceQuious', link: 'https://github.com/CyaceQuious' , other: ''},
  { name: 'czyarl', link: 'https://github.com/czyarl' , other: ''},
  { name: 'IrisZou-001', link: 'https://github.com/IrisZou-001' , other: ''},
  { name: 'fgaofan', link: 'https://github.com/fgaofan' , other: ''},
  { name: 'ympcMark', link: 'https://github.com/ympcMark' , other: ''}
];

interface AboutCardProps {
  mode: "simple" | "full"; 
}

const AboutCard = ({mode}: AboutCardProps) => {
  const { token } = useToken();

  return (
    <div style={{ marginBottom: token.marginLG }}>
      {mode === "full" && (
        <Title
          level={2}
          style={{ textAlign: 'center', marginBottom: token.marginLG }}
        >
          关于数据平台
        </Title>
      )}

      <Card title="项目介绍" style={{ marginBottom: token.marginLG }}>
        bjsh98.db（大体协数据库）是一个为北京市大学生体育协会（简称“大体协”）成绩查询页开发的数据检索平台，借助于信息化技术，尤其是软件技术和互联网技术，支持赛会组织方、运动员、观众等群体高效、安全地上传、修正、查询相关赛事成绩数据，优化落后的查询模式。
      </Card>

      {mode === "full" && (
        <Card title="网站功能" style={{ marginBottom: token.marginLG }}>
          <Typography>
            <Title level={3}>搜索</Title>

            <Title level={4}>基础搜索</Title>
            <Paragraph>
              可以根据<strong>姓名</strong>、<strong>代表队</strong>、<strong>运动会</strong>三个关键词搜索
              <Link href="https://wx.bjsh98.com/client/index.html#page_meet">原网页</Link>
              的成绩信息。<strong>姓名</strong>栏可以输入多个（用","分隔），当成绩条目的选手是这些名字之一时会被检索到。
              <strong>运动会</strong>栏也可以输入多个（用","分隔），当成绩条目的比赛名称包含所有这些关键词时会被检索到。
            </Paragraph>

            <Title level={4}>高级搜索</Title>
            <Paragraph>
              <strong>项目信息：</strong>
              <br />
              <strong>性别、组别、比赛项目、类型</strong>四个字段用于定位比赛的项目，例如"男子甲组1500米决赛"的四个字段分别为"男子""甲组""1500米""决赛"。
              原网页的成绩条目的"性别"只有"男子""女子""混合"三种。
            </Paragraph>
            <Paragraph>
              <strong>精确搜索：</strong>
              <br />
              这个开关打开时，<strong>运动会</strong>、<strong>代表队</strong>和<strong>项目信息</strong>要求成绩条目的相应字段与关键词完全一致，
              而关闭时只要求成绩条目的相应字段<strong>包含</strong>关键词。注意<strong>姓名</strong>无论是否打开该开关，
              都要求成绩条目的相应字段与关键词完全一致。
            </Paragraph>
            <Paragraph>
              <strong>其他：</strong>
              <br />
              还可以选择只显示排名前八名的成绩，只显示我关注选手的成绩。
            </Paragraph>

            <Title level={4}>检索结果</Title>
            <Paragraph>
              点击检索结果的<strong>姓名</strong>，可以显示该选手的卡片，包含了每个参与过的项目的个人最好成绩、级别；
              如果该选手通过认证与某用户相关联，也会显示关联的用户名、邮箱（如果该用户设置了）。点击卡片左上角的星星图案，
              可以关注/取消关注该选手。
              <br />
              点击检索结果的<strong>运动会</strong>一栏，可以跳转到该比赛的主页。
            </Paragraph>

            <Title level={3}>比赛</Title>
            <Paragraph>
              比赛主页包括团体总分排名和项目列表，项目列表提供了类似原网站的视图。
            </Paragraph>

            <Title level={3}>用户主页</Title>
            <Paragraph>
              <strong>个人资料</strong>页可以查看自己的基本信息、权限、关注列表，点击关注列表中的名字同样会显示 ta 的选手卡片。
              <br />
              <strong>运动员认证</strong>页可以申请认证（需要给一个有体干权限的号审核，目前填 caeious 就行），查看申请记录。
            </Paragraph>
          </Typography>
        </Card>
      )}

      {mode === "full" && (
        <Card title="开发者" style={{ marginBottom: token.marginLG }}>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={Developers}
            renderItem={(item) => (
              <List.Item style={{ margin: 0, paddingLeft: '10px', paddingRight: '10px' }}>
                <Link
                  href={item.link}
                  style={{
                    color: token.colorPrimary,
                    transition: 'color 0.3s',
                  }}
                >
                  {item.name}
                </Link>
                <Text>{item.other}</Text>
              </List.Item>
            )}
          />
        </Card>
      )}

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
  );
};

export default AboutCard;
