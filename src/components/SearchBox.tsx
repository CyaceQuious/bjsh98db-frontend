import {
  Button,
  Form,
  Row,
  Col,
  theme,
  Card,
  Divider,
} from 'antd';
import { useState } from 'react';
import { MinusSquareOutlined, PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import SearchTextBox from "./SearchTextBox";
import { SearchQuery } from "../utils/types";
import { getSearchButtonText, getSearchHistoryDelete } from "../utils/lang";
import SearchBooleanBox from './SearchBooleanBox';
import { DeleteOutlined } from '@ant-design/icons';

import { JSX } from 'react';

const { useToken } = theme;

interface SearchItem{
  key: keyof SearchQuery;
  type: string;
  width: number[];
}

interface SearchBoxProps {
  query: SearchQuery;
  queryTextChange: (name: keyof SearchQuery, value: string | undefined) => void;
  queryBooleanChange: (name: keyof SearchQuery, value: boolean) => void;
  showAdvancedChange: (value: boolean) => void;
  doSearch: () => void;
  briefButton: boolean; // whether only show the 'Search' button
  searchItems: SearchItem[];
  advanceItems: SearchItem[];
  showAdvanced: boolean;
}

export default function SearchBox({
  query,
  queryTextChange,
  queryBooleanChange,
  showAdvancedChange,
  doSearch,
  searchItems, 
  advanceItems,
  briefButton, 
  showAdvanced,
}: SearchBoxProps) {
  const { token } = useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const basicSearchBoxes: JSX.Element[] = [];
  const advancedSearchBoxes: JSX.Element[] = [];
  const allFunctionCallOnQuery: any[] = [];
  const allFunctionDeleteHistory: any[] = [];

  const handleSearch: FormProps['onFinish'] = async () => {
    try {
      setLoading(true);
      allFunctionCallOnQuery.forEach((item) => { item() });
      await doSearch();
    } finally {
      setLoading(false);
    }
  };

  const pushItem = (item: SearchItem) => {
    const curr = item.type === 'text' ?
      SearchTextBox({ name: item.key, query: query[item.key] as string, textChange: queryTextChange }) :
      SearchBooleanBox({ name: item.key, query: query[item.key] as boolean, booleanChange: queryBooleanChange });
    const element = (
      <Col
        key={item.key.toString()}
        xs={item.width[0]}
        sm={item.width[1]}
        md={item.width[2]}
        lg={item.width[3]}
      >
        <Form.Item name={item.key} 
          style={{height: '100%', marginTop: token.marginSM, marginBottom: token.marginSM}}>
          {curr.item}
        </Form.Item>
      </Col>
    );
    allFunctionCallOnQuery.push(curr.callFunc);
    allFunctionDeleteHistory.push(curr.clearFunc);
    return element;
  }

  searchItems.forEach(item => {
    const element = pushItem(item);
    basicSearchBoxes.push(element);
  });

  advanceItems.forEach(item => {
    const element = pushItem(item);
    advancedSearchBoxes.push(element);
  });

  const buttonsComponent = (<>
    {!briefButton && <Col
      xs={24}
      sm={24}
      md={21}
      lg={21}
      style={{
        textAlign: 'right',
        marginTop: token.marginSM
      }}
    >
      {advanceItems.length > 0 && <Button
        variant="dashed"
        color="default"
        icon={showAdvanced ? <MinusSquareOutlined/> : <PlusSquareOutlined/>}
        onClick={() => showAdvancedChange(!showAdvanced)}
      >
        {showAdvanced ? '收起高级搜索' : '高级搜索'}
      </Button>}
      <Button
        variant="dashed"
        color="danger"
        icon={<DeleteOutlined />}
        onClick={() => allFunctionDeleteHistory.forEach((item) => item())}
        disabled={history.length === 0}
      >
        {getSearchHistoryDelete()}
      </Button>
    </Col>}

    <Col
      xs={24}
      sm={24}
      md={3}
      lg={3}
      style={{
        textAlign: 'right',
        // marginTop: token.marginSM
      }}
    >
      <Button
        variant="solid"
        color="primary"
        icon={<SearchOutlined />}
        htmlType="submit"
        loading={loading}
        style={{
          width: 120,
          height: token.controlHeightLG
        }}
      >
        {getSearchButtonText()}
      </Button>
    </Col>
  </>)

  return (
    <Card 
      title={<>搜索</>}
    >
    <Form
      form={form}
      onFinish={handleSearch}
      initialValues={query}
      autoComplete="off"
    >
      <Row
        gutter={[token.marginSM, token.marginSM]}
        align="middle"
      >
        {briefButton ? 
        <>
        {basicSearchBoxes}
        {advancedSearchBoxes}
        </>
        : <>
        {basicSearchBoxes}
        <Col span={24}>
          <div
            style={{
              maxHeight: showAdvanced ? '1000px' : '0',
              opacity: showAdvanced ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s, opacity 0.2s',
            }}
          >
            <Row gutter={[token.marginSM, token.marginSM]}>
              {advancedSearchBoxes}
            </Row>
          </div>
        </Col></>}
        {briefButton ? buttonsComponent : <></>}
      </Row>
      {!briefButton&&<><Divider style={{ 
        margin: `${token.marginXS}px 0`,
        borderColor: token.colorBorderSecondary 
      }}/>

      <Row align="middle">
        {buttonsComponent}
      </Row>
      </>
      }
    </Form>
    </Card>
  );
}