// src/lib/callsApi.ts

const getHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const getCleanBaseUrl = (baseUrl: string) => {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return cleanBase.endsWith('/chats') ? cleanBase.slice(0, -6) : cleanBase;
};

// فئة خطأ تخص الـ API لحفظ رمز الحالة والبيانات
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// ✅ دالة استخراج callId من أي شكل ممكن للرد
function extractCallId(data: any): string | undefined {
  if (!data) return undefined;

  if (Array.isArray(data)) {
    return extractCallId(data[0]);
  }

  if (typeof data === 'string') return data;
  if (data._id) return data._id;
  if (data.id) return data.id;
  if (data.callId) return data.callId;

  if (data.call) return extractCallId(data.call);
  if (data.data) return extractCallId(data.data);
  if (data.response) return extractCallId(data.response);
  if (data.activeCall) return extractCallId(data.activeCall);
  if (data.calls) return extractCallId(data.calls);

  return undefined;
}

export async function startCallApi(
  apiBase: string,
  token: string,
  body: { calleeId: string; callType: 'audio' | 'video' }
) {
  const baseUrl = getCleanBaseUrl(apiBase);
  const url = `${baseUrl}/chats/calls/start`;

  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(body),
  });

  const rawText = await res.text().catch(() => '');
  let data: any = {};
  try {
    data = JSON.parse(rawText);
  } catch {
    data = { response: rawText };
  }

  if (!res.ok) {
    const errorMsg =
      data?.response || data?.message || rawText || `HTTP ${res.status}`;
    throw new ApiError(res.status, errorMsg, data);
  }

  return data;
}

export async function joinCallApi(
  apiBase: string,
  token: string,
  callId: string
) {
  const baseUrl = getCleanBaseUrl(apiBase);
  const res = await fetch(`${baseUrl}/chats/calls/${callId}/join`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`);
  return res.json();
}

export async function declineCallApi(
  apiBase: string,
  token: string,
  callId: string
) {
  const baseUrl = getCleanBaseUrl(apiBase);
  const res = await fetch(`${baseUrl}/chats/calls/${callId}/decline`, {
    method: 'POST',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`);
  return res.json();
}

// ✅ تعريف واحد فقط لـ getActiveCallsApi — بيرجع { raw, callId }
export async function getActiveCallsApi(apiBase: string, token: string) {
  const baseUrl = getCleanBaseUrl(apiBase);
  const res = await fetch(`${baseUrl}/chats/calls/active`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`);
  const data = await res.json();

  return {
    raw: data,
    callId: extractCallId(data),
  };
}

export async function endCallApi(
  apiBase: string,
  token: string,
  callId?: string
) {
  const baseUrl = getCleanBaseUrl(apiBase);

  // لو مافيش callId، نجيبها من /active
  let targetCallId = callId;
  if (!targetCallId) {
    try {
      const activeData = await getActiveCallsApi(apiBase, token);
      targetCallId = activeData.callId;
    } catch (e) {
      console.warn('Could not fetch active call for ending:', e);
    }
  }

  // ⚠️ لو لسه مافيش callId، مانحاولش ندق مسار غير موجود
  if (!targetCallId) {
    console.warn('endCallApi: no callId available, skipping');
    return { success: false, reason: 'no_call_id' };
  }

  const url = `${baseUrl}/chats/calls/${targetCallId}/end`;
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ callId: targetCallId }),
  });

  if (!res.ok) {
    throw new ApiError(res.status, `HTTP ${res.status}`);
  }
  return res.json().catch(() => ({ success: true }));
}

export async function getCallHistoryApi(apiBase: string, token: string) {
  const baseUrl = getCleanBaseUrl(apiBase);
  const res = await fetch(`${baseUrl}/chats/calls/history`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}`);
  return res.json();
}