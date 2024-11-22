import express from "express"
import path from "path"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000
import bcrypt from "bcrypt"; // blowfish 암호화 알고리즘을 사용하게 해주는 자바스크립트 파일
const saltRounds = 10; // 복잡도 (값이 클수록 복잡도 증가 -> 해독하기 불가능함)
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const users = []; // 컴퓨터 메모리에, 배열(Array)이라는 객체 형태의 자료형 (=저장공간)

app.use(express.static('public'));
app.use(express.json());  // 요청Body를 express가 처리(=이해)
app.use(express.urlencoded({extended: true})); 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "notice.html"));
})

app.post('/signup', (req, res) => {
  // post로 전달된 요청정보는 요청Body에 담겨서 서버로 전달되므로, 필요한 정보만 구조분해할당으로 분해
  const {user_gubun, user_id, user_pwd, user_name, user_phone, user_email, user_sms, user_file} = req.body;
  bcrypt.hash(user_pwd, saltRounds, function(err, hash) {    
    // Store hash in your password DB : 해싱된 암호(hash)를 DB에 저장
    console.log("해싱된 암호 : ", hash)
    users.push({
      role: user_gubun,
      id: user_id,
      pwd: hash,
      name: user_name,
      phone: user_phone,
      email: user_email,
      sms: user_sms ? "y": "n",
      file: user_file
    });
    console.log(users);
});

  
  res.send("회원가입 성공!")
})

app.post('/signin', (req, res) => {
  res.send("/signin 페이지를 보고 계십니다.");
  
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})