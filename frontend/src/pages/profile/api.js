import { requestJson } from '../../api/client.js';

export async function getMyProfile() {
  const payload = await requestJson('/api/auth/me');
  return payload?.data || {};
}

export async function updateMyProfile(data) {
  const payload = await requestJson('/api/auth/me', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return payload?.data?.user || payload?.user;
}

export async function changeMyPassword(data) {
  return requestJson('/api/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteMyAccount() {
  return requestJson('/api/auth/me', { method: 'DELETE' });
}
