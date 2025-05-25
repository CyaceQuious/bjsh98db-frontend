import { Button, Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { request } from '../utils/network';
import { filterByType } from '../utils/types';

interface DeleteRequest {
  session: string;
  id: string;
}

interface DeleteResponse {
  code: number;
  info: string;
}

interface ProjectDelFormProps {
  values: object; 
  // 触发按钮的样式
  buttonStyle?: React.CSSProperties;
  // 提交成功回调
  onSuccess: () => void;
}

const ProjectDelForm = ({
  values,
  buttonStyle,
  onSuccess,
}: ProjectDelFormProps) => {
  const session = useSelector((state: RootState) => state.auth.session);

  // 删除比赛相关函数
  const handleDeleteClick = (values: DeleteRequest) => {
    Modal.confirm({
      title: `确认删除该项目？`,
      content: '此操作不可撤销，请谨慎操作！',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log(`删除比赛项目: ${values}`);
        deleteMeetRequest(values);
        message.success(`删除操作已提交`);
      },
      onCancel() {
        message.info('已取消删除');
      },
    });
  };
  const deleteMeetRequest = async (values: DeleteRequest) => {
    try {
      const data: DeleteResponse = await request(
        `/api/manage_project`,
        'DELETE',
        filterByType<DeleteRequest>({
          ...values,
          session,
        },['session', 'id']),
        false,
        'json'
      );
      if (data.code !== 0) {
        message.warning(data.info || 'Failed to delete');
      }
    } catch (err) {
      message.warning('An error occurred while deleting' + err);
      console.log('Put error:', err);
    } finally {
      onSuccess();
    }
  }

  return (
    <>
      <Button
          variant="filled"
          color="danger"
          onClick={() => handleDeleteClick({...values} as DeleteRequest)}
          style={buttonStyle}
          icon={<DeleteOutlined />}
      >
          删除
      </Button>
    </>
  );
};

export default ProjectDelForm;