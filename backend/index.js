import express from "express"
import path from "path"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000
app.use(express.static('public'))
app.get('/', (req, res) => {
  // res.send('<h1>Hello World!</h1>')
  res.sendFile(path.join(__dirname, "notice.html")); // 서버 점검을 알리는 웹문서를 클라이언트에 전송하는 명령
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})