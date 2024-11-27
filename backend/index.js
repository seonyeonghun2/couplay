import express from "express";
import path from "path";
import cookieParser from "cookie-parser"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
import bcrypt from "bcrypt"; // blowfish 암호화 알고리즘을 사용하게 해주는 자바스크립트 파일
const saltRounds = 10; // 복잡도 (값이 클수록 복잡도 증가 -> 해독하기 불가능함)
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

const users = []; // 컴퓨터 메모리에, 배열(Array)이라는 객체 형태의 자료형 (=저장공간)
import mongoose from "mongoose";

// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://demouser:demo1234@cluster0.t0bqn.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0";

// 몽구스로 몽고DB 연결하는 run 함수 정의
async function run() {
  try {
    const result = await mongoose.connect(uri);
    if (result) {
      console.log(
        "================== MongoDB Atlas is connected ==============="
      );
    } else {
      console.log("================== MongoDB Atlas is failed ===============");
    }
  } catch (err) {
    console.log("에러 : ", err);
    throw new Error("몽고DB 데이터베이스 연결 오류!");
  }
}

// 몽구스로 db 연결시 에러발생하면, 에러 출력
run().catch((err) => console.log(err));

// user 스키마 정의
const userSchema = new mongoose.Schema({
  role: {
    type: Number,
    enum: [0, 1],
  },
  id: {
    type: String,
    unique: true,
    minlength: 5,
    required: true,
    lowercase: true,
  },
  pwd: {
    type: String,
    minlength: 5,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  sms: {
    type: String,
    enum: ["y", "n"],
  },
  email: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema); // 실제 DB에서는 user 저장됨

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json()); // 요청Body를 express가 처리(=이해)
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "notice.html"));
});

app.post("/signup", (req, res) => {
  try {
    // post로 전달된 요청정보는 요청Body에 담겨서 서버로 전달되므로, 필요한 정보만 구조분해할당으로 분해
    const {
      user_gubun,
      user_id,
      user_pwd,
      user_name,
      user_phone,
      user_email,
      user_sms,
    } = req.body;

    bcrypt.hash(user_pwd, saltRounds, async function (err, hash) {
      const user = await User.create({
        role: user_gubun,
        id: user_id,
        pwd: hash,
        name: user_name,
        phone: user_phone,
        email: user_email,
        sms: user_sms,
      });
      if (!user) {
        throw new Error("사용자 생성 실패!");
      }
      // 클라이언트에게 응답 : 쿠키/토큰 (클라이언트로 전송)
      /*
      res.status(200).json({
        status: 'ok',
        message: "회원 가입 성공",        
      });
      */
     // 회원가입 성공하면, 현재 회원의 ID등의 정보를 Cookie로 저장해서 Client에 전송!
     // Client가 Server에 요청(Request)할 때 쿠키 정보를 HTTP Header에 담아서 전송해줌
     res.send('<script>alert("회원가입 성공, 홈으로 이동합니다.");location.href="/";</script>')
    });
  } catch (err) {
    console.log(err);
    // throw new Error("회원가입 오류!");
  }
});

app.post("/signin", async (req, res) => {
  try {
    const {user_id, user_pwd} = req.body  
    const foundUser = await User.find({ id: user_id });
    if (foundUser.length == 0) {
      res.status(401).json({
        status: 'fail',
        message: "사용자가 존재하지 않습니다."
      })
    }
    const match = await bcrypt.compare(user_pwd, foundUser[0].pwd)
    if (match) {
      // 로그인 성공 쿠키 : 사용자ID, 이름등의 로그인 정보를 기록
      const loginInfo = JSON.stringify({
        login_id: foundUser[0].id,
        user_name: foundUser[0].name,
        user_email: foundUser[0].email,
        user_createdAt: foundUser[0].createdAt
      })
      res.cookie('login_user', foundUser[0].id, {
        httpOnly: true,
        maxAge: 60000        
      })
      res.status(200).json({
        status: 'success',
        message: '로그인 성공'
      })
    } else {
      res.status(200).json({
        status: 'fail',
        message: '로그인 실패'
      })
    }
    // res.send("/signin 페이지를 보고 계십니다.");
  } catch (err) {
    console.log(err);
  }
});

app.get("/bucket", (req, res) => {
  try {
    if (req.cookies.login_user) {      
      res.send("쿠키정보가 존재합니다")
    } else {
      res.status(401).json({
        status: "fail",
        message: "로그인이 필요합니다"
      }) 
    }
  } catch (err) {
    console.log(err)
  }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
