# PBS 소셜 트레이너

## 프로젝트 개요
사회적 기술 훈련을 돕는 React 기반 모바일 웹앱.
Supabase 회원 시스템, 캐릭터 커스터마이징, 상점, 학습/시뮬레이션 기능을 포함.

## 기술 스택
- React 19 + Vite 8
- Tailwind CSS v4
- localStorage 기반 데이터 저장 (인증 없음, 회원 시스템 제거됨)
- ESLint (react-hooks, react-refresh)
- Vercel 배포 연결 완료

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
  App.jsx / App.css       # localStorage 기반 게임 상태, 화면 라우팅
  index.css
  screens/
    HomeScreen.jsx        # 홈
    StoryIntroScreen.jsx  # LUMOS 스토리 인트로
    StageSelectScreen.jsx # 스테이지(교실) 선택
    DashboardScreen.jsx   # 대시보드
    LearningScreen.jsx    # 학습 (카드 플립 + 퀴즈)
    SimulationScreen.jsx  # 보스전 시뮬레이션
    ShopScreen.jsx        # 상점
    MyPageScreen.jsx      # 마이페이지
  components/
    BottomNav.jsx         # 하단 내비게이션
    CharacterPreview.jsx  # 캐릭터 미리보기
    CharacterSVG.jsx      # 캐릭터 SVG 렌더러
    LevelUpPopup.jsx      # 레벨업 팝업
    ProgressGoals.jsx     # 진행 목표
    StatusBar.jsx         # 상태 바
    minigames/            # 보스전 미니게임 엔진 (gameType별 컴포넌트)
  data/
    shopItems.js          # 상점 아이템 데이터
    lumosStages.js         # 8개 스테이지(몬스터/스킬카드/정화아이템) 데이터
    dailyMissions.js       # 일일 미션 풀
  assets/
    hero.png
  hooks/
    useIsMobile.js        # 모바일 감지 훅
public/
  favicon.svg
  icons.svg
  items/                  # 아이템/정화아이템 이미지
  monsters/               # 몬스터 이미지
generate-chars-only.mjs   # 캐릭터 이미지 생성 스크립트
generate-item-images.mjs  # 아이템 이미지 생성 스크립트
```

## 화면 구성
| 스크린 | 역할 |
|---|---|
| HomeScreen | 홈 / 진입점 |
| StoryIntroScreen | LUMOS 스토리 인트로 |
| StageSelectScreen | 스테이지(교실) 선택 |
| DashboardScreen | 현황 대시보드 |
| LearningScreen | 사회적 기술 학습 (카드 플립 + 퀴즈) |
| SimulationScreen | 보스전 시뮬레이션 |
| ShopScreen | 캐릭터/아이템 상점 |
| MyPageScreen | 마이페이지 |

## 완성된 기능
- [x] React + Vite + Tailwind 프로젝트 세팅
- [x] localStorage 기반 게임 데이터 저장 (인증 없음)
- [x] 8개 스크린 컴포넌트 구조
- [x] 캐릭터 SVG 렌더러 (`CharacterSVG.jsx`)
- [x] 하단 내비게이션 (`BottomNav.jsx`)
- [x] 모바일 감지 훅 (`useIsMobile.js`)
- [x] 상점 아이템 데이터 (`shopItems.js`)
- [x] LUMOS 8스테이지 데이터/스토리/스테이지선택 UI (`lumosStages.js`)
- [x] 캐릭터·아이템 이미지 생성 스크립트
- [x] Vercel 배포 연결

## 미완성 / 구성 필요
- [ ] 보스전 미니게임 엔진 — Stage 1·2만 구현, Stage 3~8은 기존 탭 플로우
- [ ] 스테이지 배경 이미지 — Stage 1·2만 생성됨
- [ ] 캐릭터/정화아이템 최종 이미지 — 유저가 추후 제공
- [ ] node_modules 재설치 필요 (`npm install`)
