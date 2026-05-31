let sessionId = localStorage.getItem('kyrgyz_session_id');
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem('kyrgyz_session_id', sessionId);
}
export const SESSION_ID = sessionId;
