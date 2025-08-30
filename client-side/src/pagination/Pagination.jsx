import React from 'react'

const Pagination = ({currentPage,totalPages,onPageChange}) => {
  return (
    <div className='flex justify-center gap-3 mt-6'>
        <button
        onClick={()=>onPageChange(Math.max(currentPage-1,1))}
        disabled={currentPage ===1}
        className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'>
            Prev
        </button>

        <span className="px-4 py-2 font-semibold">
            {currentPage} / {totalPages}
        </span>

        <button
        onClick={()=>onPageChange(Math.min(currentPage+1,totalPages))}
        disabled={currentPage === totalPages}
        className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'>
            Next
        </button>


        
    </div>
  )
}

export default Pagination
