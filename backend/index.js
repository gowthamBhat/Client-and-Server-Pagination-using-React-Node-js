const express = require('express')
const cors = require('cors')

const app = express()
const oracledb = require('oracledb')
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

process.on('uncaughtException', (e) => {
  console.log('WE GOT AN UNCAUGHT EXCEPTION')
  console.log(e)

  process.exit(1)
})
process.on('unhandledRejection', (e) => {
  console.log('WE GOT AN UNHANDLED PROMISE')
  console.log(e)

  process.exit(1)
})

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
var connection

//TODO: need to create a sepeare module for database con
async function connectDatabase() {
  try {
    connection = await oracledb.getConnection({
      user: 'system',
      password: 'gowtham123',
      tns: 'localhost/xepdb1'
    })

    console.log('Successfully connected to Oracle Database')
  } catch (error) {
    console.log(error)
  }
}
connectDatabase()

app.get('/allposts', async (req, res) => {
  try {
    let result = await connection.execute(`select * from shop`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    })

    res.send(result.rows)
  } catch (err) {
    console.error(err)
  }
})
app.get('/totalnumposts', async (req, res) => {
  try {
    let result = await connection.execute(
      `SELECT COUNT(id) as totCount
    FROM shop`
    )

    res.send({ totalPosts: result.rows[0].TOTCOUNT })
  } catch (err) {
    console.error(err)
  }
})
app.get('/paginatedposts/:currentPageNo', async (req, res) => {
  try {
    const currentPage = Number(req.params.currentPageNo)
    const postPerPage = 12
    const indexOfLastPost = currentPage * postPerPage
    const indexOfFirstPost = indexOfLastPost - postPerPage

    const startingLimit = (currentPage - 1) * postPerPage

    let strt = currentPage == 1 ? 0 : currentPage
    strt *= 12

    const last = strt + 11
    console.log(`SELECT * FROM (
      SELECT t.*, ROW_NUMBER() OVER (ORDER BY id) rnum
      FROM shop t
    )
    WHERE rnum BETWEEN  ${strt} AND ${last}`)

    let result = await connection.execute(
      `SELECT * FROM (
        SELECT t.*, ROW_NUMBER() OVER (ORDER BY id) rnum
        FROM shop t
      )
      WHERE rnum BETWEEN  ${strt} AND ${last}`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      }
    )

    res.send(result.rows)
  } catch (err) {
    console.error(err)
  }
})

const port = process.env.PORT || 8222
app.listen(port, (error) => {
  if (error) console.log(error)

  console.log(`listing on port ${port}...`)
})
