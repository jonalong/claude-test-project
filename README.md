# Cotton Bat 🦇

킹받는 직장인을 위한 말 순화 서비스. 거칠고 감정적인 문장을 원하는 말투로 정중하게 바꿔드립니다.

> 조나롱이 클로드와 함께 테스트로 진행한 프로젝트입니다.

🔗 **라이브 서비스**: https://claude-test-project-d2b26.web.app

---

## 주요 기능

### 2단계 변환 플로우
1. **분출 입력** — 화나는 말을 검열 없이 그대로 입력
2. **말투 선택** — 8가지 스타일 중 원하는 톤 선택
3. **순화 결과** — 변환된 문장 확인 및 복사

### 말투 8종
| 말투 | 특징 |
|---|---|
| 정중하게 | `-겠습니다`, `-드립니다` 등 격식체 |
| 부드럽게 | `-요` 종결어미, 의문형 부탁 |
| 단호+예의 | 명확한 진술 + `-해 주세요` |
| 애교 | `~어용`, `ㅠㅠ`, 🙏 이모지 |
| 유머러스 | 재치 있는 비유, 😅 이모지 |
| 담백하게 | 핵심 사실만, 최소 표현 |
| 다정하게 | 수고 인정 후 부드럽게 요청 |
| 프로페셔널 | 사실 기반, 비즈니스 문서체 |

### 분노 게이지
- 원문·순화문의 거칠기를 0~100점으로 측정
- 10단계 등급 (평온 그 자체 😇 ~ 핵불닭급 ☢️)
- 게이지 시각화 + AI 한 줄 위트 코멘트

### 기타
- 결과 원클릭 복사 (토스트 알림)
- 로고 클릭 시 첫 화면 이동
- 모바일 최적화 (iOS / Android 키보드 대응)

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend (로컬) | Node.js + Express (`server.js`) |
| Backend (프로덕션) | Firebase Cloud Functions v2 (`functions/index.js`) |
| AI | Claude Haiku 4.5 (Anthropic API), 프롬프트 캐싱 적용 |
| 배포 | Firebase Hosting + Firebase Functions |

---

## 로컬 개발

### 1. 의존성 설치

```bash
npm install
cd functions && npm install && cd ..
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일 생성 후 Anthropic API 키 입력

```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

### 3. 개발 서버 실행

```bash
npm run dev
```

- 클라이언트: `http://localhost:5173`
- API 서버: `http://localhost:3001`
- `/api/*` 요청은 Vite 프록시를 통해 자동으로 3001 포트로 전달

### 스크립트

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 클라이언트 + Express 서버 동시 실행 |
| `npm run client` | Vite 개발 서버만 실행 |
| `npm run server` | Express API 서버만 실행 |
| `npm run build` | 프로덕션 빌드 (`dist/`) |

---

## Firebase 배포

```bash
# 1. 프로덕션 빌드
npm run build

# 2. Hosting + Functions 배포
npx firebase-tools deploy --only hosting,functions
```

> Functions 배포 시 `ANTHROPIC_API_KEY` Secret이 Firebase Secret Manager에 등록되어 있어야 합니다.

---

## 프로젝트 구조

```
├── src/                  # React 프론트엔드
│   ├── App.jsx           # 메인 컴포넌트 (4단계 플로우)
│   ├── main.jsx
│   └── assets/
├── functions/            # Firebase Cloud Functions (프로덕션 API)
│   └── index.js
├── server.js             # Express 서버 (로컬 개발용)
├── firebase.json         # Firebase 배포 설정
└── vite.config.js        # Vite 설정 (API 프록시 포함)
```
