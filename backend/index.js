import express from "express";
import path from "path";
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
      // 클라이언트에게 응답
      res.status(200).json(user);
    });
  } catch (err) {
    console.log(err);
    // throw new Error("회원가입 오류!");
  }
});

app.post("/signin", (req, res) => {
  res.send("/signin 페이지를 보고 계십니다.");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
