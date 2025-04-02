import React, { useState, useEffect } from 'react';
import {Pagination} from "../components/Pagination"
// 定义表格数据的类型
interface TableData {
  id: number;
  name: string;
}

// 定义表格头部的类型
interface TableHeaders {
  key: keyof TableData;
  label: string;
}

// 表格组件的 props 类型
interface TableComponentProps {
  data: TableData[];
  headers: TableHeaders[];
}

// 表格组件
const TableComponent: React.FC<TableComponentProps> = ({ data, headers }) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header.key}>{header.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {headers.map((header) => (
              <td key={header.key}>{row[header.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ContestsPage = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 每页显示5条数据
  const contests:TableData[] = ([{id: 1,name:"qwqw"},{id: 2, name:"qaqqaq"}]);
  // 获取当前页的数据
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  // 切换页面的函数
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // ...更新数据的函数保持不变...

  useEffect(() => {
    // 假设 fetchData 是一个异步函数，用于从服务器获取数据
    const fetchData = async () => {
      // 模拟获取数据
      const dataFromServer: TableData[] = [
        // ...数据...
      ];
      setTableData(dataFromServer);
    };

    fetchData();
  }, []);
  const headers: TableHeaders[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    ];

  return (
    <div>
      <h1>比赛列表</h1>
      <TableComponent data={contests} headers={headers} />
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={tableData.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ContestsPage;
