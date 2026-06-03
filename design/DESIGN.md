---
version: alpha
name: 테스트 디자인 시스템
description: Pretendard 기반의 모노톤 베이스 + 핑크 액센트 모바일(AOS/iOS) 디자인 시스템
colors:
  # Neutral (Gray)
  white: "#ffffff"
  gray-50: "#f8f8f9"
  gray-100: "#efeff1"
  gray-200: "#e3e4e6"
  gray-300: "#d1d4d8"
  gray-400: "#b5b8bc"
  gray-500: "#797d86"
  gray-600: "#5a6169"
  gray-700: "#414752"
  gray-800: "#2d333b"
  gray-900: "#121212"
  neutral: "{colors.gray-900}"
  # Primary (Pink)
  primary: "#ff3967"
  primary-100: "#ffeaef"
  primary-200: "#ffc7d4"
  primary-300: "#ff88a4"
  primary-400: "#ff6488"
  primary-500: "#ff3967"
  primary-600: "#ef1447"
  primary-700: "#c7002e"
  primary-800: "#920022"
  primary-900: "#5c0016"
  # Secondary (Cyan)
  secondary: "#06d2ee"
  secondary-100: "#d6faff"
  secondary-200: "#b6f6ff"
  secondary-300: "#83f0ff"
  secondary-400: "#34e7ff"
  secondary-500: "#06d2ee"
  secondary-600: "#00bed8"
  secondary-700: "#009cb2"
  secondary-800: "#006573"
  secondary-900: "#003d45"
  # Roles
  on-primary: "{colors.white}"
  on-secondary: "{colors.white}"
  text-primary: "{colors.gray-900}"
  text-secondary: "{colors.gray-500}"
  background: "{colors.white}"
typography:
  h1:
    fontFamily: Pretendard
    fontSize: 36px
    fontWeight: 600
    lineHeight: 51px
    letterSpacing: 0
  h2:
    fontFamily: Pretendard
    fontSize: 36px
    fontWeight: 300
    lineHeight: 51px
    letterSpacing: 0
  h3:
    fontFamily: Pretendard
    fontSize: 26px
    fontWeight: 600
    lineHeight: 34px
    letterSpacing: 0
  h4:
    fontFamily: Pretendard
    fontSize: 26px
    fontWeight: 300
    lineHeight: 34px
    letterSpacing: 0
  h5:
    fontFamily: Pretendard
    fontSize: 22px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: 0
  h6:
    fontFamily: Pretendard
    fontSize: 22px
    fontWeight: 400
    lineHeight: 32px
    letterSpacing: 0
  title1:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: 600
    lineHeight: 26px
    letterSpacing: 0
  title2:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: 500
    lineHeight: 26px
    letterSpacing: 0
  title3:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: 400
    lineHeight: 26px
    letterSpacing: 0
  title4:
    fontFamily: Pretendard
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0
  body1:
    fontFamily: Pretendard
    fontSize: 16px
    fontWeight: 500
    lineHeight: 23px
    letterSpacing: 0
  body2:
    fontFamily: Pretendard
    fontSize: 16px
    fontWeight: 400
    lineHeight: 23px
    letterSpacing: 0
  body3:
    fontFamily: Pretendard
    fontSize: 15px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0
  body4:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0
  body5:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0
  body6:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0
  footnote1:
    fontFamily: Pretendard
    fontSize: 13px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0
  footnote2:
    fontFamily: Pretendard
    fontSize: 13px
    fontWeight: 500
    lineHeight: 18px
    letterSpacing: 0
  footnote3:
    fontFamily: Pretendard
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0
  footnote4:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0
  footnote5:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0
  footnote6:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0
  caption1:
    fontFamily: Pretendard
    fontSize: 11px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0
  caption2:
    fontFamily: Pretendard
    fontSize: 11px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0
  caption3:
    fontFamily: Pretendard
    fontSize: 10px
    fontWeight: 600
    lineHeight: 14px
    letterSpacing: 0
  caption4:
    fontFamily: Pretendard
    fontSize: 10px
    fontWeight: 400
    lineHeight: 14px
    letterSpacing: 0
  caption5:
    fontFamily: Pretendard
    fontSize: 9px
    fontWeight: 400
    lineHeight: 14px
    letterSpacing: 0
  caption6:
    fontFamily: Pretendard
    fontSize: 9px
    fontWeight: 500
    lineHeight: 14px
    letterSpacing: 0
rounded:
  md: 8px
spacing:
  none: "0px"
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 40px
  xxxl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body1}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.body1}"
    rounded: "{rounded.md}"
  tab:
    textColor: "{colors.text-primary}"
    typography: "{typography.title4}"
  bottom-nav-label:
    textColor: "{colors.text-secondary}"
    typography: "{typography.caption3}"
  input-label:
    textColor: "{colors.text-primary}"
    typography: "{typography.footnote1}"
  color-swatch:
    rounded: "{rounded.md}"
---

## Overview

모노톤(Gray) 베이스 위에 선명한 핑크 계열 Primary를 단일 액센트로 사용하는
모바일 우선 디자인 시스템입니다. 컬러 무드는 White, Gray/900, Primary, 그라데이션
조합을 기본 베이스로 삼아 절제된 분위기와 강한 행동 유도(CTA)를 동시에 달성합니다.
모든 토큰은 AOS(Android)와 iOS에서 동일하게 적용되는 것을 전제로 설계되었습니다.

## Colors

팔레트는 고대비 중립색(Gray) 위에 Primary(핑크)와 Secondary(시안) 두 개의
액센트 스케일로 구성됩니다. 각 액센트는 100~900까지 9단계를 가집니다.

- **Neutral / Gray (#f8f8f9 ~ #121212):** UI의 기본 골격. 텍스트, 보더, 배경,
  비활성 상태에 사용합니다. `gray-900`(#121212)이 기본 텍스트, `gray-500`(#797d86)이
  보조 텍스트, `white`(#ffffff)가 기본 배경입니다.
- **Primary / 핑크 (대표 #ff3967):** 시스템의 유일한 주 액센트이자 CTA·강조의
  중심입니다. 300단계부터 텍스트 가독성을 위해 흰색 글자를 얹습니다.
- **Secondary / 시안 (대표 #06d2ee):** 보조 강조 및 정보성 요소에 제한적으로
  사용합니다. 600단계부터 흰색 글자를 얹습니다.

대비 가이드: 밝은 칩(50~200, Primary 100~200, Secondary 100~400)에는 어두운 글자,
어두운 칩(Gray 500~900, Primary 300~900, Secondary 600~900)에는 흰색 글자를 사용합니다.

## Typography

서체는 **Pretendard** 단일 패밀리를 사용하며, AOS·iOS에 동일하게 적용됩니다.

- 본문/실사용 weight는 **Regular(400)** 와 **Semibold(600)** 두 가지를 주로 사용합니다.
- **Light(300)** 는 디자인(시각) 용도 전용으로, Large Title H2·H4에만 사용합니다.
- **Medium(500)** 은 특정 케이스(상단바 타이틀, 액션 버튼, 작은 버튼 등) 외 사용을 제한합니다.

스케일은 크게 4계열로 나뉩니다.

- **Large Title (H1~H6):** 36/26/22px 디스플레이·페이지 타이틀 계열.
- **Title (Title1~4):** 18~16px 소제목·상단바 타이틀·탭·본문 강조.
- **Body (Body1~6):** 16~14px 본문·버튼·썸네일 텍스트.
- **Footnote / Caption (13~9px):** 인풋 라벨, 설명, 하단 네비게이션 라벨 등 보조 텍스트.

주요 용도 매핑: 상단바 타이틀=Title2 / 액션 버튼=Body1 / 인풋 라벨=Footnote1 /
하단 네비게이션바=Caption3·4·5·6.

## Layout

모바일 우선 레이아웃을 기준으로 하며, 컴포넌트 간 정렬은 좌측 정렬(start)을 기본값으로
사용합니다. 간격(spacing)은 **8px 그리드**를 기준으로 한 토큰 스케일을 사용합니다.

- **xxs(2px) · xs(4px):** 아이콘과 라벨 사이 등 초밀착 간격.
- **sm(8px):** 기본 최소 간격, 칩·태그 내부 패딩.
- **md(16px):** 카드 내부 패딩, 리스트 항목 간 기본 간격.
- **lg(24px):** 섹션 내 그룹 간 간격.
- **xl(32px) · xxl(40px) · xxxl(48px):** 화면 섹션 구분, 상·하단 여백.

> 본 spacing 스케일은 원본 Figma 시트에 명시된 토큰이 아니라 관찰된 8px 그리드를 바탕으로
> 정의한 권장 기본값입니다. 실제 운영 토큰이 확정되면 값을 교체해 사용하세요.

## Shapes

- **rounded.md (8px):** 색상 칩, 카드, 버튼 등 사각 요소의 표준 모서리 반경입니다.
- 로고는 워드마크 + 심볼 형태로 제공되며, 별도의 컬러 변형 없이 모노톤/Primary
  조합 안에서 사용합니다.

## Components

- **button-primary:** Primary(#ff3967) 배경 + 흰색 글자, Body1, 8px 라운드. 기본 CTA.
- **button-secondary:** Secondary(#06d2ee) 배경 + 흰색 글자, Body1, 8px 라운드. 보조 액션.
- **tab:** Title4(Semibold 16) 텍스트. 탭/본문 강조용.
- **bottom-nav-label:** Caption3(Semibold 10) 보조 텍스트 컬러. 하단 네비게이션.
- **input-label:** Footnote1(Semibold 13) 기본 텍스트 컬러. 폼 라벨.

## Do's and Don'ts

- **Do** 액센트는 화면당 Primary 하나를 중심으로 절제해서 사용합니다.
- **Do** 본문에는 Regular/Semibold만 사용합니다.
- **Do** 어두운 배경 칩 위에는 흰색 글자로 대비를 확보합니다.
- **Don't** Light(300)를 본문에 사용하지 않습니다 — 디자인 시각 용도(H2/H4)에 한정합니다.
- **Don't** Medium(500)을 지정된 케이스(타이틀·버튼) 밖에서 남용하지 않습니다.
- **Don't** Primary와 Secondary를 같은 위계의 액센트로 동시에 강하게 사용하지 않습니다.
