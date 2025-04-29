const db = require('./DBinfo');
const jwt = require('jsonwebtoken');

const postSignUp = (req, res) => {
  const { email, password, username } = req.body;
  // 필수값 체크
  if (!email || !password || !username) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  };

  const query = `
  INSERT INTO users (email, password, username) VALUES (?, ?, ?);
  `;

  db.query(query, [email, password, username], (err, result) => {
    if (err) {
      console.error("회원가입 실패:", err);
      return res.status(500).json({ message: "회원가입 중 오류가 발생했습니다." });
    }
    return res.status(201).json({ message: "회원가입 성공", userId: result.insertId });
  });
  
};

const postLogin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "이메일과 비밀번호를 입력하세요." });

  const sql = `
  SELECT * FROM users WHERE email = ?;
  `;

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('DB 오류:', err);
      return res.status(500).json({ message: "서버 오류" });
    }
    if (results.length === 0)
      return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  });
};

module.exports = { postSignUp, postLogin };