# 여행의 조각들

해외여행의 계획과 기록을 모으는 웹사이트입니다. 첫 여행은 2026년 오사카 7박 8일 일정입니다.

## 현재 화면

- `/`: 큰 사진 카드로 여행 선택
- `/trips/osaka-2026`: 날짜별 일정, 예약 안내, 공개 기록 영역
- `/design/studio`: 기존 임시 편집 화면에서 오사카 일정으로 이동

Supabase 데이터베이스와 사진 저장소가 Vercel 프로젝트에 연결되어 있습니다. 오사카 일정은 첫 관리자 저장 전까지 기본 데이터로 표시되며, 저장 후에는 데이터베이스 내용을 사용합니다.

## 다른 여행 추가 구조

`data/trip-types.ts`의 `TripDocument`가 모든 여행의 공통 형식입니다. 오사카는 `data/trips.ts`에 담긴 첫 데이터이고, 홈 카드와 `/trips/[slug]` 상세 페이지는 이 형식의 내용을 받아 표시합니다. 새 여행의 국가·도시·기간·사진·제목을 입력하면 `data/create-trip.ts`가 날짜를 자동 생성하는 초안을 만듭니다. 저장소와 관리자 로그인 연결 후 `/admin/trips/new`에서 이 초안을 만들고, 공개 상태로 바꾸면 홈 카드 목록에 나타납니다.

## 실행

```bash
npm install
npm run dev
```

## 자동 배포

이 저장소의 `main` 브랜치는 기존 Vercel 프로젝트 `travel-film-archive`에 연결되어 있습니다.
완료한 코드 변경을 커밋하고 `origin/main`에 푸시하면 Vercel이 운영 사이트를 자동 배포합니다.
로컬 파일을 저장하는 것만으로는 배포가 시작되지 않습니다. `.env.local`과 `.vercel`은 Git에서 제외됩니다.
관리자 화면에서 저장한 여행 내용은 Supabase에 직접 저장되어 코드 배포 없이 반영됩니다.

## 저장 및 관리

- `supabase/schema.sql`의 여행 테이블, 읽기 정책, 공개 사진 버킷을 Supabase에 적용했습니다.
- Vercel에는 Supabase 환경 변수와 운영 사이트 URL이 연결되어 있습니다. `ADMIN_EMAILS`에 등록된 이메일만 `/admin/login`에서 로그인해 일정을 수정할 수 있습니다.
- Google 로그인 전용 Cloud 프로젝트는 `travel-film-lasthere7-2026`입니다. 이 프로젝트에서 OAuth 웹 클라이언트를 만들고 Supabase Authentication → Sign In / Providers → Google에 Client ID와 Client Secret을 등록한 뒤 활성화합니다. Google에 등록할 리디렉션 URI는 `https://pfsqxlhitphgyluhsfqe.supabase.co/auth/v1/callback`입니다. Supabase Auth의 허용 리디렉션 URL에는 운영 사이트의 `/auth/callback`이 등록되어 있습니다.
- Google 제공자 설정을 마친 뒤 Vercel의 `GOOGLE_AUTH_ENABLED=true`를 설정하고 다시 배포하면 Google 버튼이 표시됩니다. 이메일 링크 로그인은 접힌 대체 수단으로 남습니다. Google 계정의 이메일이 `ADMIN_EMAILS`에 없는 경우 세션을 종료하고 관리자 화면 접근을 거부합니다.
- 오사카 데이터는 첫 관리자 저장 시 데이터베이스에 들어갑니다. 다른 여행은 `/admin/trips/new`에서 초안을 만들고 대표 사진·일정을 입력한 뒤 게시합니다.
- 게시된 여행과 메모·사진은 방문자에게 공개됩니다.

## 무료 DB 활동 유지

`vercel.json`은 `/api/cron/supabase-activity`를 매일 UTC 00:00(한국시간 09:00)에 호출합니다. 이 경로는 운영 환경의 `CRON_SECRET`으로 보호되며 `trips` 테이블에 가벼운 읽기 요청 3회를 보냅니다. 실제 방문자 요청도 DB를 읽습니다. 무료 프로젝트의 일시 중지를 막는 절대적인 보장은 아니므로 Supabase의 프로젝트 상태와 경고 메일도 확인해야 합니다.

자세한 화면 구조와 완료 기준은 [리디자인_설계.md](./리디자인_설계.md)에 있습니다.
