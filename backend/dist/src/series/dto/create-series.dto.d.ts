import { SeriesStatus } from '@prisma/client';
export declare class CreateSeriesDto {
    name: string;
    releaseDate: string;
    synopsis?: string;
    country?: string;
    seasons?: number;
    rating?: number;
    status?: SeriesStatus;
    directorIds: string[];
}
