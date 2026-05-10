import { requestJson } from '../../api/client.js';

export async function getAdminStats() {
  const payload = await requestJson('/api/admin/stats');
  return payload?.data || {};
}

export async function getAdminUsers() {
  const payload = await requestJson('/api/admin/users');
  return payload?.data?.users || [];
}

export async function getAdminTrips() {
  const payload = await requestJson('/api/admin/trips');
  return payload?.data?.trips || [];
}

export async function updateUserStatus(userId, status) {
  const payload = await requestJson(`/api/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
  return payload?.data?.user || payload?.user;
}
