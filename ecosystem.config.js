module.exports = {
    apps: [
      {
        name: "capstone2025-be",
        script: "./server.js",
        env: {
          NODE_ENV: "production",
          // 필요시 다른 환경변수도 추가
        },
        watch: false, // 코드 변경 시 자동 재시작을 원하면 true로 설정
      },
    ],
  };
  