import { NextResponse } from 'next/server';
import { getUser, createClient } from '@/lib/supabase/server';
import { estimateSize } from '@/lib/openapi/curl';

export async function POST(request: Request) {
  const body = await request.json();
  const { url, method, headers, body: requestBody, endpoint } = body;

  if (!url || !method) {
    return NextResponse.json({ error: 'URL and method are required' }, { status: 400 });
  }

  const start = Date.now();
  let responseStatus = 0;
  let responseStatusText = '';
  const responseHeaders: Record<string, string> = {};
  let responseBody = '';
  let errorDetails: string | undefined;

  try {
    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: headers ?? {},
    };

    if (requestBody && !['GET', 'HEAD'].includes(method.toUpperCase())) {
      fetchOptions.body = requestBody;
    }

    const response = await fetch(url, fetchOptions);
    responseStatus = response.status;
    responseStatusText = response.statusText;
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    responseBody = await response.text();
  } catch (err) {
    errorDetails = err instanceof Error ? err.message : 'Request failed';
    responseStatus = 0;
    responseStatusText = 'Error';
  }

  const durationMs = Date.now() - start;
  const requestSize = estimateSize(requestBody) + estimateSize(JSON.stringify(headers ?? {}));
  const responseSize = estimateSize(responseBody);

  const user = await getUser();
  if (user) {
    const supabase = await createClient();
    await supabase.from('request_history').insert({
      user_id: user.id,
      method: method.toUpperCase(),
      url,
      endpoint: endpoint ?? null,
      request_size: requestSize,
      response_size: responseSize,
      status_code: responseStatus || null,
      duration_ms: durationMs,
      error_details: errorDetails ?? null,
      request_headers: headers ?? {},
      request_body: requestBody ?? null,
      response_headers: responseHeaders,
      response_body: responseBody,
    });
  }

  return NextResponse.json({
    status: responseStatus,
    statusText: responseStatusText,
    headers: responseHeaders,
    body: responseBody,
    durationMs,
    error: errorDetails,
  });
}
