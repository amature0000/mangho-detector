let heartbeatInterval = null;

async function startHeartbeat(interval) {
  console.log("[SEAF] HEARTBEAT start: ", interval);
  // 기존 루프 제거
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  if(!interval) return;
  // 루프 생성
  heartbeatInterval = setInterval(() => {
    chrome.runtime.sendMessage({ type: "HEARTBEAT_CHECK" });
  }, interval);
}

startHeartbeat();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CONTROL_HEARTBEAT") {
    startHeartbeat(request.interval);
  }
});