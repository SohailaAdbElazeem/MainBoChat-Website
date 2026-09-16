// src/lib/callsApi.ts

const getHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export async function startCallApi(
  apiBase: string,
  token: string,
  body: { calleeId: string; callType: 'audio' | 'video' }
) {
  const res = await fetch(`${apiBase}/chats/calls/start`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function joinCallApi(
  apiBase: string,
  token: string,
  callId: string
) {
  const res = await fetch(`${apiBase}/chats/calls/${callId}/join`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function declineCallApi(
  apiBase: string,
  token: string,
  callId: string
) {
  const res = await fetch(`${apiBase}/chats/calls/${callId}/decline`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function endCallApi(
  apiBase: string,
  token: string,
  callId: string
) {
  const res = await fetch(`${apiBase}/chats/calls/${callId}/end`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getActiveCallsApi(apiBase: string, token: string) {
  const res = await fetch(`${apiBase}/chats/calls/active`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getCallHistoryApi(apiBase: string, token: string) {
  const res = await fetch(`${apiBase}/chats/calls/history`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}