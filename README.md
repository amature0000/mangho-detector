# MANGHO-detector

해당 프로그램은 [SEAF-assistant](https://github.com/Toddoward/SEAF-Assistant)의 경량화 버전으로, 일부 기능만을 추출하여 개선하였습니다.

개선된 내용 중 핵심 수정사항은 SEAF-assistant 정식 배포 버전에 반영됩니다.

과거 tampermonkey script 버전은 `5124557` 커밋 시점을 참고하십시오.

---

## 설치 방법

### 소스코드 설치
1. 녹색 `<> Code` 버튼을 누르고 Download ZIP 으로 압축파일 다운로드
  > <img width="428" height="359" alt="image" src="https://github.com/user-attachments/assets/4535e1b1-1d68-4af9-a606-3792bcbe73f1" />

2. 압축 해제
3. Chrome 주소창에 `chrome://extensions/` 입력
4. **개발자 모드** 활성화
5. **압축해제된 확장 프로그램을 로드합니다** 클릭
6. 압축 해제한 폴더 선택

### Chrome Web Store
```
정식 배포 예정 없음
```
---
## 주요 기능

### foreground scanner
- 게시글 목록에서 모집글 제목에 `참가` 버튼을 추가해 즉시 참여 기능 제공
> <img width="356" height="55" alt="화면 캡처 2026-02-18 152257" src="https://github.com/user-attachments/assets/64e59525-f492-4944-9aa4-d5a849e3af64" />

### background scanner
- 주기적으로 최신 게시글 탐색
- 신규 모집글 감지 시 토스트 알림 제공
> <img width="375" height="133" alt="화면 캡처 2026-02-18 152342" src="https://github.com/user-attachments/assets/bc12a258-0c17-4984-97ae-7bc9fd5bb6c1" />

### configuration
- background scanner ON/OFF
- 탐색 주기 조정 (1~30초)
- 토스트 알림 지속 시간 조정 (3~30초)
- 갤러리 id, 링크, 탭 이름을 수정해 다른 갤러리에 적용 가능
> <img width="355" height="553" alt="image" src="https://github.com/user-attachments/assets/4e4cfd7c-4a50-45f2-a8e6-d8e297dba4bf" />

### configuration-guide
- 갤러리 id: 원하는 마이너 갤러리의 id를 입력
- 망호 목록 링크: **망호 탭을 누른 다음** 페이지 주소를 복사
- 탭 이름: 망호 탭 이름을 입력
---

## 개발 가이드라인
자세한 사항은 SEAF-assistant의 문서를 참조하십시오.

### 네이밍 규칙
- 모든 CSS 클래스: `seaf-` 접두사 (디시인사이드 스타일 충돌 방지)
- 예: `.seaf-toast-container`, `.seaf-btn`, `.seaf-category-grid`
