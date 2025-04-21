interface PagerHeaderProps {
  itemsPerPage: number;
  totalItems: number;
  handleItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function PagerHeader({ itemsPerPage, totalItems, handleItemsPerPageChange }: PagerHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
    <div>
      <span>每页显示: </span>
      <select 
      value={itemsPerPage} 
      onChange={handleItemsPerPageChange}
      style={{ padding: '5px', marginLeft: '5px' }}
      >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      </select>
    </div>
    <div>
      <span>共 {totalItems} 条记录</span>
    </div>
    </div>
  )
}

interface PagerFooterProps {
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
}
export function PagerFooter({ currentPage, totalPages, paginate }: PagerFooterProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
    <button 
      onClick={() => paginate(1)} 
      disabled={currentPage === 1}
      style={{ 
        padding: '5px 10px', 
        margin: '0 5px', 
        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        opacity: currentPage === 1 ? 0.5 : 1
      }}
    >
      首页
    </button>
    <button 
      onClick={() => paginate(currentPage - 1)} 
      disabled={currentPage === 1}
      style={{ 
        padding: '5px 10px', 
        margin: '0 5px', 
        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        opacity: currentPage === 1 ? 0.5 : 1
      }}
    >
      上一页
    </button>
    
    {/* 页码显示 */}
    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      // 显示当前页附近的页码
      let pageNumber;
      if (totalPages <= 5) {
        pageNumber = i + 1;
      } else if (currentPage <= 3) {
        pageNumber = i + 1;
      } else if (currentPage >= totalPages - 2) {
        pageNumber = totalPages - 4 + i;
      } else {
        pageNumber = currentPage - 2 + i;
      }
      
      return (
        <button
          key={pageNumber}
          onClick={() => paginate(pageNumber)}
          style={{
            padding: '5px 10px',
            margin: '0 5px',
            fontWeight: currentPage === pageNumber ? 'bold' : 'normal',
            backgroundColor: currentPage === pageNumber ? '#f0f0f0' : 'transparent',
            cursor: 'pointer'
          }}
        >
          {pageNumber}
        </button>
      );
    })}
    
    <button 
      onClick={() => paginate(currentPage + 1)} 
      disabled={currentPage === totalPages}
      style={{ 
        padding: '5px 10px', 
        margin: '0 5px', 
        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        opacity: currentPage === totalPages ? 0.5 : 1
      }}
    >
      下一页
    </button>
    <button 
      onClick={() => paginate(totalPages)} 
      disabled={currentPage === totalPages}
      style={{ 
        padding: '5px 10px', 
        margin: '0 5px', 
        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        opacity: currentPage === totalPages ? 0.5 : 1
      }}
    >
      末页
    </button>
  </div>
  )
}

interface PagerCurrentProps {
  currentPage: number;
  totalPages: number;
}
export function PagerCurrent({ currentPage, totalPages }: PagerCurrentProps) {
  return (
    <div style={{ textAlign: 'center', marginTop: '10px' }}>
      <span>第 {currentPage} 页 / 共 {totalPages} 页</span>
    </div>
  )
}