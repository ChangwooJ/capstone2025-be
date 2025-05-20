module.exports = {
    apps: [
      {
        name: "capstone2025-be",
        script: "./server.js",
        env: {
          NODE_ENV: "production",
          JWT_SECRET : "4c0d608098b78d61cf5654965dab8b53632bf831dc6b43f29289411376ac107b",
          UPBIT_OPEN_API_ACCESS_KEY : "sGzGpFhhxYe2JBFt5RXcGWod2WIczd9pkjlqRxFV",
          UPBIT_OPEN_API_SECRET_KEY : "hyJRCyR4SZK3xk1mDZIrn995zkSbIbslkdOJWKhD",
          DB_PASSWORD : "nexbit2025!"
        },
        watch: false, // 코드 변경 시 자동 재시작을 원하면 true로 설정
      },
    ],
  };
  