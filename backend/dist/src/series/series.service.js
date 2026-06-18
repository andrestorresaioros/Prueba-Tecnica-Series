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
exports.SeriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const seriesInclude = {
    directors: {
        include: {
            director: true,
        },
        orderBy: {
            director: {
                fullName: 'asc',
            },
        },
    },
};
let SeriesService = class SeriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const directorIds = this.normalizeIds(dto.directorIds);
        await this.ensureDirectorsExist(directorIds);
        const series = await this.prisma.series.create({
            data: {
                name: dto.name.trim(),
                releaseDate: new Date(dto.releaseDate),
                synopsis: dto.synopsis?.trim(),
                country: dto.country?.trim(),
                seasons: dto.seasons,
                rating: dto.rating,
                status: dto.status,
                directors: {
                    create: directorIds.map((directorId) => ({
                        director: { connect: { id: directorId } },
                        role: 'DIRECTOR',
                    })),
                },
            },
            include: seriesInclude,
        });
        return this.toResponse(series);
    }
    async findAll(search) {
        const series = await this.prisma.series.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { country: { contains: search, mode: 'insensitive' } },
                        { directors: { some: { director: { fullName: { contains: search, mode: 'insensitive' } } } } },
                    ],
                }
                : undefined,
            include: seriesInclude,
            orderBy: [{ releaseDate: 'desc' }, { name: 'asc' }],
        });
        return series.map((item) => this.toResponse(item));
    }
    async findOne(id) {
        const series = await this.prisma.series.findUnique({
            where: { id },
            include: seriesInclude,
        });
        if (!series) {
            throw new common_1.NotFoundException(`No existe una serie con id ${id}.`);
        }
        return this.toResponse(series);
    }
    async update(id, dto) {
        const current = await this.prisma.series.findUnique({ where: { id } });
        if (!current) {
            throw new common_1.NotFoundException(`No existe una serie con id ${id}.`);
        }
        const directorIds = dto.directorIds ? this.normalizeIds(dto.directorIds) : undefined;
        if (dto.directorIds && directorIds?.length === 0) {
            throw new common_1.BadRequestException('La serie debe tener al menos un director asociado.');
        }
        const series = await this.prisma.$transaction(async (tx) => {
            if (directorIds) {
                await this.ensureDirectorsExist(directorIds, tx);
            }
            return tx.series.update({
                where: { id },
                data: {
                    name: dto.name?.trim(),
                    releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
                    synopsis: dto.synopsis?.trim(),
                    country: dto.country?.trim(),
                    seasons: dto.seasons,
                    rating: dto.rating,
                    status: dto.status,
                    directors: directorIds
                        ? {
                            deleteMany: {},
                            create: directorIds.map((directorId) => ({
                                director: { connect: { id: directorId } },
                                role: 'DIRECTOR',
                            })),
                        }
                        : undefined,
                },
                include: seriesInclude,
            });
        });
        return this.toResponse(series);
    }
    async remove(id) {
        const existing = await this.prisma.series.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`No existe una serie con id ${id}.`);
        }
        await this.prisma.series.delete({ where: { id } });
        return { message: 'Serie eliminada correctamente.', id };
    }
    normalizeIds(ids) {
        return [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
    }
    async ensureDirectorsExist(ids, tx = this.prisma) {
        const count = await tx.director.count({ where: { id: { in: ids } } });
        if (count !== ids.length) {
            throw new common_1.NotFoundException('Uno o más directores enviados no existen.');
        }
    }
    toResponse(series) {
        return {
            id: series.id,
            name: series.name,
            releaseDate: series.releaseDate,
            synopsis: series.synopsis,
            country: series.country,
            seasons: series.seasons,
            rating: series.rating ? Number(series.rating) : null,
            status: series.status,
            createdAt: series.createdAt,
            updatedAt: series.updatedAt,
            directors: series.directors.map(({ director, role }) => ({
                id: director.id,
                fullName: director.fullName,
                nationality: director.nationality,
                birthDate: director.birthDate,
                biography: director.biography,
                role,
            })),
        };
    }
};
exports.SeriesService = SeriesService;
exports.SeriesService = SeriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeriesService);
//# sourceMappingURL=series.service.js.map