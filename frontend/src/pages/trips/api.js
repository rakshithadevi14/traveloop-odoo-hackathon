const TOKEN_KEY = 'traveloop_token';

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {})
    }
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }

  return payload;
}

export async function getTrips() {
  const payload = await requestJson('/api/trips');
  return Array.isArray(payload) ? payload : payload?.trips || payload?.data?.trips || payload?.data || [];
}

export async function getTripById(id) {
  const payload = await requestJson(`/api/trips/${id}`);
  return payload?.trip || payload?.data?.trip || payload?.data || payload;
}

export async function createTrip(data) {
  const payload = await requestJson('/api/trips', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return payload?.trip || payload?.data?.trip || payload?.data || payload;
}

export async function updateTrip(id, data) {
  const payload = await requestJson(`/api/trips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return payload?.trip || payload?.data?.trip || payload?.data || payload;
}

export async function deleteTrip(id) {
  await requestJson(`/api/trips/${id}`, { method: 'DELETE' });
}

export async function getTripItinerary(tripId) {
  const payload = await requestJson(`/api/trips/${tripId}/itinerary`);
  return payload?.itinerary || payload?.data || payload;
}

export async function createStop(tripId, data) {
  const payload = await requestJson(`/api/trips/${tripId}/stops`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return payload?.stop || payload?.data || payload;
}

export async function deleteStop(tripId, stopId) {
  await requestJson(`/api/trips/${tripId}/stops/${stopId}`, { method: 'DELETE' });
}

export async function createActivity(stopId, data) {
  const payload = await requestJson(`/api/stops/${stopId}/activities`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return payload?.activity || payload?.data || payload;
}

export async function deleteActivity(stopId, activityId) {
  await requestJson(`/api/stops/${stopId}/activities/${activityId}`, { method: 'DELETE' });
}

export async function getTripBudget(tripId) {
  const payload = await requestJson(`/api/trips/${tripId}/budget`);
  return payload?.budget || payload?.data?.budget || payload?.data || payload;
}

export async function updateTripBudget(tripId, totalBudget) {
  const payload = await requestJson(`/api/trips/${tripId}/budget`, {
    method: 'PUT',
    body: JSON.stringify({ totalBudget: Number(totalBudget) })
  });
  return payload?.budget || payload?.data?.budget || payload?.data || payload;
}

export async function createExpense(tripId, data) {
  const payload = await requestJson(`/api/trips/${tripId}/expenses`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return payload?.expense || payload?.data?.expense || payload?.data || payload;
}

export async function getTripExpenses(tripId) {
  const payload = await requestJson(`/api/trips/${tripId}/expenses`);
  return payload?.expenses || payload?.data?.expenses || payload?.data || [];
}

export async function updateExpense(tripId, expenseId, data) {
  const payload = await requestJson(`/api/trips/${tripId}/expenses/${expenseId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return payload?.expense || payload?.data?.expense || payload?.data || payload;
}

export async function deleteExpense(tripId, expenseId) {
  await requestJson(`/api/trips/${tripId}/expenses/${expenseId}`, { method: 'DELETE' });
}

export async function getTripChecklist(tripId) {
  const payload = await requestJson(`/api/trips/${tripId}/checklist`);
  return payload?.checklist || payload?.items || payload?.data?.checklist || payload?.data || payload;
}

export async function createChecklistItem(tripId, data) {
  const payload = await requestJson(`/api/trips/${tripId}/checklist`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return payload?.item || payload?.data?.item || payload?.data || payload;
}

export async function toggleChecklistItem(tripId, itemId, checked) {
  const payload = await requestJson(`/api/trips/${tripId}/checklist/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ packed: checked })
  });
  return payload?.item || payload?.data?.item || payload?.data || payload;
}

export async function deleteChecklistItem(tripId, itemId) {
  await requestJson(`/api/trips/${tripId}/checklist/${itemId}`, { method: 'DELETE' });
}

export async function getTripNotes(tripId) {
  const payload = await requestJson(`/api/trips/${tripId}/notes`);
  return payload?.notes || payload?.data?.notes || payload?.data || payload;
}

export async function createTripNote(tripId, data) {
  const payload = await requestJson(`/api/trips/${tripId}/notes`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return payload?.note || payload?.data?.note || payload?.data || payload;
}

export async function updateTripNote(tripId, noteId, data) {
  const payload = await requestJson(`/api/trips/${tripId}/notes/${noteId}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
  return payload?.note || payload?.data?.note || payload?.data || payload;
}

export async function deleteTripNote(tripId, noteId) {
  await requestJson(`/api/trips/${tripId}/notes/${noteId}`, { method: 'DELETE' });
}

export async function getCommunityTrips() {
  const payload = await requestJson('/api/community');
  return payload?.trips || payload?.data?.trips || payload?.data || payload || [];
}

export async function getCommunityTripById(id) {
  const payload = await requestJson(`/api/community/${id}`);
  return payload?.trip || payload?.data?.trip || payload?.data || payload;
}

export async function likeCommunityTrip(id) {
  const payload = await requestJson(`/api/community/${id}/like`, { method: 'POST' });
  return payload?.trip || payload?.data?.trip || payload?.data || payload;
}

export async function copyCommunityTrip(id) {
  const payload = await requestJson(`/api/community/${id}/copy`, { method: 'POST' });
  return payload?.trip || payload?.data?.trip || payload?.data || payload;
}
