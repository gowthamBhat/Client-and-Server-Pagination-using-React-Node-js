import React from 'react'

function PaginationBar({
  postPerPage,
  totalPosts,
  paginate,
  iterator,
  endingLink,
  currentPage,
  totalNumOfPages
}) {
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
    pageNumbers.push(i)
  }
  const experimentalPage = []
  for (let i = iterator; i <= endingLink; i++) {
    experimentalPage.push(i)
  }

  return (
    <nav aria-label="...">
      <ul className="pagination pagination-lg">
        {currentPage > 1 && (
          <a
            className="page-link"
            href="#!"
            onClick={() => paginate(currentPage - 1)}
          >
            Before
          </a>
        )}
        {experimentalPage.map((x, idx) => (
          <li
            key={idx}
            className={x === currentPage ? 'page-item active' : 'page-item'}
          >
            <a className="page-link" href="#!" onClick={() => paginate(x)}>
              {x}
            </a>
          </li>
        ))}
        <li className="page-item">
          {currentPage < totalNumOfPages && (
            <a
              className="page-link"
              href="#!"
              onClick={() => paginate(currentPage + 1)}
            >
              After
            </a>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default PaginationBar
