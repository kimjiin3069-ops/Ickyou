# Ickyou / Pickyou

Pickyou 브랜드 랜딩페이지와 ICKYOU 고객 포토 리뷰 페이지.

## 사이트 구성

- `dist/index.html`: 랜딩페이지
- `dist/reviews.html`: 포토 리뷰
- `dist/style.css`: 반응형 스타일
- `dist/app.js`: 제품과 상세보기
- `dist/reviews.js`: 리뷰 사진과 확대보기
- `dist/reviews-motion.js`: 리뷰 진입 애니메이션
- `dist/assets/`: 제품 및 고객 사진

## 배포

GitHub 저장소 Settings → Pages → Build and deployment에서 Source를 **GitHub Actions**로 선택합니다.
`main` 브랜치에 푸시하면 `.github/workflows/deploy-pages.yml`이 `dist/` 폴더를 배포합니다.
빌드 또는 외부 패키지 설치는 필요하지 않습니다. 프로젝트 하위 경로에서도 동작하도록 상대 경로를 사용합니다.

GitHub Actions의 `Deploy Ickyou to GitHub Pages` 실행 결과에서 배포 URL을 확인할 수 있습니다.

## 로컬 확인

```sh
python3 -m http.server 4173 --directory dist
```

`http://localhost:4173`을 엽니다.
