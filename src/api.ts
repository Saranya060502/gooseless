import * as SecureStore from 'expo-secure-store';

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://you-me-xr77.onrender.com';

export async function getUserId(): Promise<string | null> {
  return SecureStore.getItemAsync('userId');
}

export async function setUserId(id: string) {
  await SecureStore.setItemAsync('userId', id);
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const userId = await getUserId();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(userId ? { 'x-user-id': userId } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data;
}

export async function createUser(name: string, age: number, city: string) {
  return req<{ userId: string }>('/users', {
    method: 'POST',
    body: JSON.stringify({ name, age, city }),
  });
}

export async function connectYouTube(accessToken: string) {
  return req<{ ok: boolean; channelCount: number }>('/youtube/connect', {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
  });
}

export async function getMatches() {
  return req<{ matches: any[] }>('/matches');
}

export async function startConversation(targetId: string) {
  return req<{ conversationId: string }>('/conversations', {
    method: 'POST',
    body: JSON.stringify({ targetId }),
  });
}

export async function getMessages(convId: string) {
  return req<{ messages: any[] }>(`/conversations/${convId}/messages`);
}

export async function sendMessage(convId: string, text: string) {
  return req<{ message: any }>(`/conversations/${convId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}
