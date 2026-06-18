export type SeriesStatus = 'ANNOUNCED' | 'EMISSION' | 'FINISHED' | 'CANCELLED';

export interface Director {
  id: string;
  fullName: string;
  nationality?: string | null;
  birthDate?: string | null;
  biography?: string | null;
  series?: SeriesSummary[];
}

export interface SeriesSummary {
  id: string;
  name: string;
  releaseDate: string;
  country?: string | null;
  seasons: number;
  rating?: number | null;
  status: SeriesStatus;
  role?: string;
}

export interface Series {
  id: string;
  name: string;
  releaseDate: string;
  synopsis?: string | null;
  country?: string | null;
  seasons: number;
  rating?: number | null;
  status: SeriesStatus;
  directors: Array<Director & { role?: string }>;
}

export interface CreateDirectorPayload {
  fullName: string;
  nationality?: string;
  birthDate?: string;
  biography?: string;
}

export interface CreateSeriesPayload {
  name: string;
  releaseDate: string;
  synopsis?: string;
  country?: string;
  seasons?: number;
  rating?: number;
  status?: SeriesStatus;
  directorIds: string[];
}
