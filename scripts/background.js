/**
 * Project SEAF - Background Service Worker
 * 실시간 망호 게시글 감지
 */

let MANGHO_LIST_URL = "";
const DEADLINE = 5 * 60 * 1000; // 5분
let lastCheckTime = 0;

/**
 * 설정값 로드
 */
async function initSettings() {
  const { seaf_settings } = await chrome.storage.local.get(['seaf_settings']);
  if (seaf_settings?.url) {
    MANGHO_LIST_URL = seaf_settings.url;
  }

  await createOffscreen();

  let interval = (seaf_settings.pollingInterval || 5) * 1000;
  if (!seaf_settings?.isDetectionActive) interval = 0;

  chrome.runtime.sendMessage({
    type: "CONTROL_HEARTBEAT",
    interval: interval
  })
}

/**
 * offscreen 생성
 */
async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: 'scripts/offscreen.html',
    reasons: ['DOM_PARSER'],
    justification: 'monitoring&sending message'
  });
}

/**
 * 게시글 id로부터 Steam 로비 링크 추출
 */
async function extractLobbyLink(postId) {
  try {
    const viewUrl = `https://gall.dcinside.com/mgallery/board/view/?id=helldiversseries&no=${postId}`;
    const response = await fetch(viewUrl);
    const html = await response.text();
    
    const lobbyMatch = html.match(/steam:\/\/joinlobby\/\d+\/\d+/);
    // console.log(`[SEAF] 로비 링크 추출 시도 (${postId}):`, lobbyMatch[0]);
    if (lobbyMatch) {
      return lobbyMatch[0];
    }
    return null;
  } catch (error) {
    console.error(`[SEAF] 로비 링크 추출 실패 (${postId}):`, error);
    return null;
  }
}

/**
 * 실시간 감지 루프
 */
async function performDetection() {
  try {
    const { seaf_settings, lastSeenPostId } = await chrome.storage.local.get(['seaf_settings', 'lastSeenPostId']);

    // 디시인사이드 탭이 열려있는지 확인
    const tabs = await chrome.tabs.query({ 
      url: "https://*.dcinside.com/*" 
    });
    
    if (tabs.length === 0) {
      return; // 디시 탭 없으면 스킵
    }

    // 망호 목록 크롤링
    const response = await fetch(MANGHO_LIST_URL);
    const html = await response.text();
    
    // 게시글 파싱 (공지 제외)
    const postRegex = /<tr[^>]*data-no="(\d+)"[^>]*>[\s\S]*?<td class="gall_tit[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>[\s\S]*?<td class="gall_date" title="([^"]+)"/g;
    const matches = [...html.matchAll(postRegex)];
    
    const posts = matches
      .filter(m => !m[0].includes('icon_notice') && !m[0].includes('icon_fnews'))
      .map(m => ({
        id: parseInt(m[1]),
        title: m[2].replace(/<[^>]*>?/gm, '').trim(),
        fullDateStr: m[3]
      }));

    if (posts.length === 0) {
      return;
    }

    // 첫 실행 시 초기화만 하고 종료
    if (lastSeenPostId === undefined) {
      await chrome.storage.local.set({lastSeenPostId: posts[0].id});
      console.log(`[SEAF] 초기화 완료. 마지막 게시글 ID: ${posts[0].id}`);
      return;
    }

    const now = Date.now();
    // 신규 게시글 필터링 
    const newPosts = posts.filter(p => {
      // ID가 더 큰 것만
      const isNew = p.id > lastSeenPostId;
      // 최근 n분 이내
      let isRecent = true;
      if (p.fullDateStr) {
        const postTime = new Date(p.fullDateStr.replace(/-/g, '/')).getTime();
        isRecent = (now - postTime < DEADLINE);
      }
      return isNew && isRecent;
    });

    console.log(`[SEAF] 신규 게시글 ${newPosts.length}개 발견`);

    if (newPosts.length > 0) {
      // 오래된 것부터 처리
      for (const post of newPosts.reverse()) {
        await processNewPost(post, seaf_settings);
      }
      
      // 가장 최신 게시글 ID로 업데이트
      await chrome.storage.local.set({ lastSeenPostId: posts[0].id });
      console.log(`[SEAF] lastSeenPostId 업데이트: ${posts[0].id}`);
    }

  } catch (error) {
    console.error('[SEAF] 감지 엔진 오류:', error);
  }
}

/**
 * 신규 게시글 처리
 */
async function processNewPost(post, settings) {
  const { id, title } = post;
  
  console.log(`[SEAF] 새 게시글 발견: ${id}`);
  
  // 모든 디시 탭에 알림 전송
  const tabs = await chrome.tabs.query({ 
    url: "https://*.dcinside.com/*" 
  });
  
  for (const tab of tabs) {
    console.log(`[SEAF] ${tab.id} 탭에 알림 전송: [${id}] ${title}`);
    chrome.tabs.sendMessage(tab.id, {
      type: "SEAF_NEW_POST",
      postId: id,
      title: title,
      toastDuration: (settings.toastDuration || 6) * 1000 // 초 → 밀리초 변환
    }).catch(() => {
      console.log(`[SEAF] ${tab.id} 전송 실패`);
    });
  }
}

/**
 * 하트비트 제어 로직
 */
async function handleHeartbeat() {
  if (!MANGHO_LIST_URL) await initSettings();
  console.log(`[SEAF] 페이지 로드 요청`);
  performDetection();
}

/**
 * 이벤트 리스너
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "HEARTBEAT_CHECK") {
    handleHeartbeat();
  }

  if (request.type === "SETTINGS_UPDATED") {
    initSettings();
    lastCheckTime = 0;
  }
  
  if (request.type === "GET_LOBBY_LINK") {
    extractLobbyLink(request.postId).then(link => {
      sendResponse({ link });
    });
    return true; // 비동기 응답
  }
});

initSettings();