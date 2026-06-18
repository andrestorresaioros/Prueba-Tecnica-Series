import { PrismaService } from '../common/prisma/prisma.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
export declare class SeriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    private normalizeIds;
    private ensureDirectorsExist;
    private toResponse;
}
