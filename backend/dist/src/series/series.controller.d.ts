import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { SeriesService } from './series.service';
export declare class SeriesController {
    private readonly seriesService;
    constructor(seriesService: SeriesService);
    create(dto: CreateSeriesDto): Promise<{
        id: string;
        name: string;
        releaseDate: Date;
        synopsis: string | null;
        country: string | null;
        seasons: number;
        rating: number | null;
        status: import(".prisma/client").$Enums.SeriesStatus;
        createdAt: Date;
        updatedAt: Date;
        directors: {
            id: string;
            fullName: string;
            nationality: string | null;
            birthDate: Date | null;
            biography: string | null;
            role: string;
        }[];
    }>;
    findAll(search?: string): Promise<{
        id: string;
        name: string;
        releaseDate: Date;
        synopsis: string | null;
        country: string | null;
        seasons: number;
        rating: number | null;
        status: import(".prisma/client").$Enums.SeriesStatus;
        createdAt: Date;
        updatedAt: Date;
        directors: {
            id: string;
            fullName: string;
            nationality: string | null;
            birthDate: Date | null;
            biography: string | null;
            role: string;
        }[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        releaseDate: Date;
        synopsis: string | null;
        country: string | null;
        seasons: number;
        rating: number | null;
        status: import(".prisma/client").$Enums.SeriesStatus;
        createdAt: Date;
        updatedAt: Date;
        directors: {
            id: string;
            fullName: string;
            nationality: string | null;
            birthDate: Date | null;
            biography: string | null;
            role: string;
        }[];
    }>;
    update(id: string, dto: UpdateSeriesDto): Promise<{
        id: string;
        name: string;
        releaseDate: Date;
        synopsis: string | null;
        country: string | null;
        seasons: number;
        rating: number | null;
        status: import(".prisma/client").$Enums.SeriesStatus;
        createdAt: Date;
        updatedAt: Date;
        directors: {
            id: string;
            fullName: string;
            nationality: string | null;
            birthDate: Date | null;
            biography: string | null;
            role: string;
        }[];
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
