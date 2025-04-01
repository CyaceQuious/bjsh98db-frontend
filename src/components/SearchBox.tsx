import {
  Button,
  Form,
  Row,
  Col,
  theme
} from 'antd';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import SearchTextBox from "./SearchTextBox";
import { SearchQuery } from "../utils/types";
import { getSearchButtonText, getSearchHistoryDelete } from "../utils/lang";
import SearchBooleanBox from './SearchBooleanBox';
import { DeleteOutlined } from '@ant-design/icons';

const { useToken } = theme;

interface SearchBoxProps {
  query: SearchQuery;
  queryTextChange: (name: keyof SearchQuery, value: string) => void;
  queryBooleanChange: (name: keyof SearchQuery, value: boolean) => void;
  doSearch: () => void;
  searchItems: {
    key: keyof SearchQuery;
    type: 'text' | 'boolean';
    isFullLine?: boolean;
  }[];
}

export default function SearchBox({
  query,
  queryTextChange,
  queryBooleanChange,
  doSearch,
  searchItems
}: SearchBoxProps) {
  const { token } = useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const allSearchBoxes: any[] = [];
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

  searchItems.forEach((item) => {
    const curr = item.type === 'text' ?
      SearchTextBox({ name: item.key, query: query[item.key] as string, textChange: queryTextChange }) :
      SearchBooleanBox({ name: item.key, query: query[item.key] as boolean, booleanChange: queryBooleanChange });
    allSearchBoxes.push((
      <Col
        key={item.key.toString()}
        xs={item.isFullLine ? 24 : item.type === 'text' ? 24 : 8}
        sm={item.isFullLine ? 24 : item.type === 'text' ? 24 : 8}
        md={item.isFullLine ? 24 : item.type === 'text' ? 8 : 4}
        lg={item.isFullLine ? 24 : item.type === 'text' ? 8 : 4}
      >
        <Form.Item name={item.key}>
          {curr.item}
        </Form.Item>
      </Col>
    ));
    allFunctionCallOnQuery.push(curr.callFunc);
    allFunctionDeleteHistory.push(curr.clearFunc);
  })

  return (
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
        {allSearchBoxes}
        <Col
          xs={5}
          sm={5}
          md={13}
          lg={13}
          style={{
            textAlign: 'right',
            marginTop: token.marginSM
          }}
        >
          <Button
            icon={<DeleteOutlined />}
            onClick={() => allFunctionDeleteHistory.forEach((item) => item())}
            disabled={history.length === 0}
          >
            {getSearchHistoryDelete()}
          </Button>
        </Col>
        <Col
          xs={3}
          sm={3}
          md={3}
          lg={3}
          style={{
            textAlign: 'right',
            marginTop: token.marginSM
          }}
        >
          <Button
            type="primary"
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
      </Row>
    </Form>
  );
}