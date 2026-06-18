import type { CreateDirectorPayload, CreateSeriesPayload, Director, Series } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message ?? 'Ocurrió un error al consumir la API.';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  listSeries: (search = '') => request<Series[]>(`/series${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createSeries: (payload: CreateSeriesPayload) =>
    request<Series>('/series', { method: 'POST', body: JSON.stringify(payload) }),
  updateSeries: (id: string, payload: Partial<CreateSeriesPayload>) =>
    request<Series>(`/series/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteSeries: (id: string) => request<{ message: string }>(`/series/${id}`, { method: 'DELETE' }),

  listDirectors: (search = '') =>
    request<Director[]>(`/directors${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createDirector: (payload: CreateDirectorPayload) =>
    request<Director>('/directors', { method: 'POST', body: JSON.stringify(payload) }),
  updateDirector: (id: string, payload: Partial<CreateDirectorPayload>) =>
    request<Director>(`/directors/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteDirector: (id: string) => request<{ message: string }>(`/directors/${id}`, { method: 'DELETE' }),
  getDirectorSeries: (id: string) =>
    request<{ director: Pick<Director, 'id' | 'fullName' | 'nationality'>; series: Series[] }>(`/directors/${id}/series`),
};
