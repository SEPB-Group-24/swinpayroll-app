const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://swinpayroll.app';

export default async function fetchApi(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data: Record<string, string> = {}, headers: Record<string, string> = {}) {
  const isGet = method === 'GET';
  const url = new URL(`${API_URL}/api/v1/${endpoint}`);
  if (isGet) {
    url.search = new URLSearchParams(data).toString();
  }

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    ...!isGet && {
      body: JSON.stringify(data)
    }
  });

  if (!response.ok) {
    throw new Error('response not ok');
  }

  try {
    return await response.json();
  } catch {
    // swallow
  }
}
