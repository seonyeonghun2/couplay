import express from "express"
const app = express()
const port = 4321

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})