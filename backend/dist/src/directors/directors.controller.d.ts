import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { DirectorsService } from './directors.service';
export declare class DirectorsController {
    private readonly directorsService;
    constructor(directorsService: DirectorsService);
    create(dto: CreateDirectorDto): Promise<{
        id: string;
        fullName: string;
        nationality: string | null;
        birthDate: Date | null;
        biography: string | null;
        createdAt: Date;
        updatedAt: Date;
        series: {
            id: string;
            name: string;
            releaseDate: Date;
            synopsis: string | null;
            country: string | null;
            seasons: number;
            rating: number | null;
            status: import(".prisma/client").$Enums.SeriesStatus;
            role: string;
        }[];
    }>;
    findAll(search?: string): Promise<{
        id: string;
        fullName: string;
        nationality: string | null;
        birthDate: Date | null;
        biography: string | null;
        createdAt: Date;
        updatedAt: Date;
        series: {
            id: string;
            name: string;
            releaseDate: Date;
            synopsis: string | null;
            country: string | null;
            seasons: number;
            rating: number | null;
            status: import(".prisma/client").$Enums.SeriesStatus;
            role: string;
        }[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        fullName: string;
        nationality: string | null;
        birthDate: Date | null;
        biography: string | null;
        createdAt: Date;
        updatedAt: Date;
        series: {
            id: string;
            name: string;
            releaseDate: Date;
            synopsis: string | null;
            country: string | null;
            seasons: number;
            rating: number | null;
            status: import(".prisma/client").$Enums.SeriesStatus;
            role: string;
        }[];
    }>;
    findSeriesByDirector(id: string): Promise<{
        director: {
            id: string;
            fullName: string;
            nationality: string | null;
        };
        series: {
            id: string;
            name: string;
            releaseDate: Date;
            synopsis: string | null;
            country: string | null;
            seasons: number;
            rating: number | null;
            status: import(".prisma/client").$Enums.SeriesStatus;
            role: string;
        }[];
    }>;
    update(id: string, dto: UpdateDirectorDto): Promise<{
        id: string;
        fullName: string;
        nationality: string | null;
        birthDate: Date | null;
        biography: string | null;
        createdAt: Date;
        updatedAt: Date;
        series: {
            id: string;
            name: string;
            releaseDate: Date;
            synopsis: string | null;
            country: string | null;
            seasons: number;
            rating: number | null;
            status: import(".prisma/client").$Enums.SeriesStatus;
            role: string;
        }[];
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
