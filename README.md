# Cotton Bat 🦇

킹받는 직장인을 위한 말 순화 서비스. 거친 문장을 정중하고 건설적인 표현으로 바꿔드립니다.

> 조나롱이 클로드와 함께 테스트로 진행한 프로젝트입니다.

## 기능

- 비속어·인신공격 표현을 정중한 언어로 자동 변환
- 톤 강도 선택: 정중 / 부드럽게 / 단호+예의 / 짧게
- 상황 프리셋: 직장 상사 / 직장 동료 / 외부 고객 / 기타
- 결과 클립보드 복사

## 기술 스택

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **AI**: Claude Haiku (Anthropic API)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 Anthropic API 키를 입력합니다.

```
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

클라이언트는 `http://localhost:5173`, API 서버는 `http://localhost:3001` 에서 실행됩니다.

## 스크립트

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 클라이언트 + 서버 동시 실행 |
| `npm run client` | Vite 개발 서버만 실행 |
| `npm run server` | Express API 서버만 실행 |
| `npm run build` | 프로덕션 빌드 |
