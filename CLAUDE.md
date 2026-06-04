# PBS 소셜 트레이너

## 프로젝트 개요
사회적 기술 훈련을 돕는 React 기반 모바일 웹앱.
Supabase 회원 시스템, 캐릭터 커스터마이징, 상점, 학습/시뮬레이션 기능을 포함.

## 기술 스택
- React 19 + Vite 8
- Tailwind CSS v4
- Supabase JS SDK v2 — 회원/데이터 DB
- ESLint (react-hooks, react-refresh)
- Vercel 배포 연결 완료

## Supabase 설정
- URL: `https://agkktjwpiwykyhencnkw.supabase.co`
- Key: `sb_publishable_IJmNZEt3j5ZNgEOXiP_TLA_bzKycR7l`
- 연결 위치: `src/lib/supabase.js`
- **monster 프로젝트와 동일한 Supabase 프로젝트 공유 중**

## Vercel 배포
- Project ID: `prj_vnON6f7JTH9fNSGgnlGpgJw27RKP`
- Project Name: `pbs-social-trainer`

## 개발 명령어
```bash
npm install        # 최초 1회 (node_modules 없음)
npm run dev        # 개발 서버 (HMR)
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 결과 미리보기
npm run lint       # ESLint 검사
```

## 파일 구조
```
src/
  main.jsx
  App.jsx / App.css
  index.css
  screens/
    AuthScreen.jsx        # 로그인/회원가입
    HomeScreen.jsx        # 홈
    DashboardScreen.jsx   # 대시보드
    LearningScreen.jsx    # 학습
    SimulationScreen.jsx  # 시뮬레이션
    ReinforcementScreen.jsx # 강화
    ShopScreen.jsx        # 상점
    MyPageScreen.jsx      # 마이페이지
  components/
    BottomNav.jsx         # 하단 내비게이션
    CharacterPreview.jsx  # 캐릭터 미리보기
    CharacterSVG.jsx      # 캐릭터 SVG 렌더러
    LevelUpPopup.jsx      # 레벨업 팝업
    ProgressGoals.jsx     # 진행 목표
    StatusBar.jsx         # 상태 바
  data/
    shopItems.js          # 상점 아이템 데이터
  assets/
    hero.png
  lib/
    supabase.js           # Supabase 클라이언트
  hooks/
    useIsMobile.js        # 모바일 감지 훅
public/
  favicon.svg
  icons.svg
  items/                  # 아이템 이미지
generate-chars-only.mjs   # 캐릭터 이미지 생성 스크립트
generate-item-images.mjs  # 아이템 이미지 생성 스크립트
```

## 화면 구성
| 스크린 | 역할 |
|---|---|
| AuthScreen | 로그인 / 회원가입 |
| HomeScreen | 홈 / 진입점 |
| DashboardScreen | 현황 대시보드 |
| LearningScreen | 사회적 기술 학습 |
| SimulationScreen | 상황 시뮬레이션 |
| ReinforcementScreen | 긍정 강화 |
| ShopScreen | 캐릭터/아이템 상점 |
| MyPageScreen | 마이페이지 |

## 완성된 기능
- [x] React + Vite + Tailwind 프로젝트 세팅
- [x] Supabase 클라이언트 연결 (`src/lib/supabase.js`)
- [x] 8개 스크린 컴포넌트 구조
- [x] 캐릭터 SVG 렌더러 (`CharacterSVG.jsx`)
- [x] 하단 내비게이션 (`BottomNav.jsx`)
- [x] 모바일 감지 훅 (`useIsMobile.js`)
- [x] 상점 아이템 데이터 (`shopItems.js`)
- [x] 캐릭터·아이템 이미지 생성 스크립트
- [x] Vercel 배포 연결

## 미완성 / 구성 필요
- [ ] 각 스크린 세부 기능 구현 상태 확인 필요
- [ ] Supabase 테이블 스키마 정의/확인
- [ ] monster 프로젝트와 Supabase 공유 — users 테이블 충돌 여부 확인
- [ ] 학습/시뮬레이션 콘텐츠 데이터 구성
- [ ] node_modules 재설치 필요 (`npm install`)
