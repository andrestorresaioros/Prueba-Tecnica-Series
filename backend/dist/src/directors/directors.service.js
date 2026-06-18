"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const directorInclude = {
    series: {
        include: {
            series: true,
        },
        orderBy: {
            series: {
                releaseDate: 'desc',
            },
        },
    },
};
let DirectorsService = class DirectorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const director = await this.prisma.director.create({
            data: {
                fullName: dto.fullName.trim(),
                nationality: dto.nationality?.trim(),
                birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
                biography: dto.biography?.trim(),
            },
            include: directorInclude,
        });
        return this.toResponse(director);
    }
    async findAll(search) {
        const directors = await this.prisma.director.findMany({
            where: search
                ? {
                    OR: [
                        { fullName: { contains: search, mode: 'insensitive' } },
                        { nationality: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            include: directorInclude,
            orderBy: { fullName: 'asc' },
        });
        return directors.map((director) => this.toResponse(director));
    }
    async findOne(id) {
        const director = await this.prisma.director.findUnique({
            where: { id },
            include: directorInclude,
        });
        if (!director) {
            throw new common_1.NotFoundException(`No existe un director con id ${id}.`);
        }
        return this.toResponse(director);
    }
    async findSeriesByDirector(id) {
        const director = await this.findOne(id);
        return {
            director: {
                id: director.id,
                fullName: director.fullName,
                nationality: director.nationality,
            },
            series: director.series,
        };
    }
    async update(id, dto) {
        const existing = await this.prisma.director.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`No existe un director con id ${id}.`);
        }
        const director = await this.prisma.director.update({
            where: { id },
            data: {
                fullName: dto.fullName?.trim(),
                nationality: dto.nationality?.trim(),
                birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
                biography: dto.biography?.trim(),
            },
            include: directorInclude,
        });
        return this.toResponse(director);
    }
    async remove(id) {
        const existing = await this.prisma.director.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`No existe un director con id ${id}.`);
        }
        await this.prisma.director.delete({ where: { id } });
        return { message: 'Director eliminado correctamente.', id };
    }
    toResponse(director) {
        return {
            id: director.id,
            fullName: director.fullName,
            nationality: director.nationality,
            birthDate: director.birthDate,
            biography: director.biography,
            createdAt: director.createdAt,
            updatedAt: director.updatedAt,
            series: director.series.map(({ series, role }) => ({
                id: series.id,
                name: series.name,
                releaseDate: series.releaseDate,
                synopsis: series.synopsis,
                country: series.country,
                seasons: series.seasons,
                rating: series.rating ? Number(series.rating) : null,
                status: series.status,
                role,
            })),
        };
    }
};
exports.DirectorsService = DirectorsService;
exports.DirectorsService = DirectorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DirectorsService);
//# sourceMappingURL=directors.service.js.map