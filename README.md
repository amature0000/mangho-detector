# MANGHO-detector

해당 프로그램은 [SEAF-assistant](https://github.com/Toddoward/SEAF-Assistant)의 경량화 버전으로, 일부 기능만을 추출하여 개선하였습니다.

과거 tampermonkey script 버전은 `5124557` 커밋 시점을 참고하십시오.

---
## 주요 기능

### foreground scanner
- 게시글 목록에서 모집글 제목에 `참가` 버튼을 추가해 즉시 참여 기능
> <img width="356" height="55" alt="화면 캡처 2026-02-18 152257" src="https://github.com/user-attachments/assets/64e59525-f492-4944-9aa4-d5a849e3af64" />

### background scanner
- 주기적으로 최신 게시글 탐색
- 신규 모집글 감지 시 토스트 알림
> <img width="375" height="133" alt="화면 캡처 2026-02-18 152342" src="https://github.com/user-attachments/assets/bc12a258-0c17-4984-97ae-7bc9fd5bb6c1" />

### configuration
- background scanner 설정
> <img width="355" height="553" alt="image" src="https://github.com/user-attachments/assets/4e4cfd7c-4a50-45f2-a8e6-d8e297dba4bf" />

---

## 개발 가이드라인
자세한 사항은 SEAF-assistant의 문서를 참조하십시오.

### 네이밍 규칙
- 모든 CSS 클래스: `seaf-` 접두사 (디시인사이드 스타일 충돌 방지)
- 예: `.seaf-toast-container`, `.seaf-btn`, `.seaf-category-grid`
