import {
  Button,
  Form,
  Row,
  Col,
  Typography,
  theme
} from 'antd';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import SearchTextBox from "./SearchTextBox";
import { SearchQuery } from "../utils/types";
import { getSearchButtonText } from "../utils/lang";
import SearchBooleanBox from './SearchBooleanBox';

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

  const handleSearch: FormProps['onFinish'] = async () => {
    try {
      setLoading(true);
      await doSearch();
    } finally {
      setLoading(false);
    }
  };

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
        {searchItems.map((item) => (
          <Col
            key={item.key.toString()}
            xs={item.isFullLine ? 24 : item.type === 'text' ? 24 : 8}
            sm={item.isFullLine ? 24 : item.type === 'text' ? 24 : 8}
            md={item.isFullLine ? 24 : item.type === 'text' ? 8 : 4}
            lg={item.isFullLine ? 24 : item.type === 'text' ? 8 : 4}
          >
            {item.type === 'text' ? (
              <Form.Item name={item.key}>
                <SearchTextBox
                  name={item.key}
                  query={query[item.key] as string}
                  textChange={queryTextChange}
                />
              </Form.Item>
            ) : (
              <Form.Item name={item.key}>
                <SearchBooleanBox
                  name={item.key}
                  query={query[item.key] as boolean}
                  booleanChange={queryBooleanChange}
                />
              </Form.Item>
            )}
          </Col>
        ))}

        <Col
          xs={8}
          sm={8}
          md={16}
          lg={16}
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