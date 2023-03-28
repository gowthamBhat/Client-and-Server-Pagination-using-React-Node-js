import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import PaginationBar from './PaginationBar'
function ItemList() {
  const [shopItems, setShopItems] = useState([])
  const [postPerPage] = useState(12)
  const [currentPage, setcurrentPage] = useState(1)
  const [totalPostsLength, setTotalPostLength] = useState(null)

  useEffect(() => {
    console.log('item list logged one time')
    getAllpostsLength()
    paginate(1)
  }, [])

  async function getListofItems() {
    let { data } = await axios.get('http://localhost:8222/allposts')
    // data.map((x) => console.log(x['NAME']))
    setShopItems(data)

    console.log(data.length)
  }
  async function getAllpostsLength() {
    let { data } = await axios.get('http://localhost:8222/totalnumposts')
    // data.map((x) => console.log(x['NAME']))
    setTotalPostLength(data['totalPosts'])
  }
  const paginate = async (pagenum) => {
    setcurrentPage(pagenum)
    let { data } = await axios.get(
      `http://localhost:8222/paginatedposts/${pagenum}`
    )
    setShopItems(data)
  }

  const indexOfLastPost = currentPage * postPerPage
  const indexOfFirstPost = indexOfLastPost - postPerPage
  const currentPosts = shopItems.slice(indexOfFirstPost, indexOfLastPost)

  const totalNumOfPages = Math.ceil(totalPostsLength / postPerPage)
  let iterator = currentPage - 5 < 1 ? 1 : currentPage - 5
  let endingLink =
    iterator + 9 <= totalNumOfPages
      ? iterator + 9
      : currentPage + (totalNumOfPages - currentPage)
  if (endingLink < currentPage + 4) {
    iterator -= currentPage + 4 - totalNumOfPages
  }

  return (
    <div>
      <div className="items_holder">
        {shopItems.map((x, idx) => (
          <div key={idx} className="card" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: 'tomato' }}>
                {x['NAME']}
              </h5>
              <h6 className="card-subtitle mb-2" style={{ color: '#000' }}>
                Price - {x['PRICE']} , Items In Stock - {x['STOCK']}
              </h6>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's.
              </p>
              {/* <a href="www.google.com" className="card-link">
                Card link
              </a>
              <a href="www.google.com" className="card-link">
                Another link
              </a> */}
            </div>
          </div>
        ))}
      </div>
      <div className="paginationbar_container">
        {' '}
        <PaginationBar
          postPerPage={postPerPage}
          totalPosts={shopItems.length}
          paginate={paginate}
          currentPage={currentPage}
          iterator={iterator}
          totalNumOfPages={totalNumOfPages}
          endingLink={endingLink}
        />
      </div>
    </div>
  )
}

export default ItemList
