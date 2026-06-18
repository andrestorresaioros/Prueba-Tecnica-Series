import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';

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
} satisfies Prisma.SeriesInclude;

@Injectable()
export class SeriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSeriesDto) {
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

  async findAll(search?: string) {
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

  async findOne(id: string) {
    const series = await this.prisma.series.findUnique({
      where: { id },
      include: seriesInclude,
    });

    if (!series) {
      throw new NotFoundException(`No existe una serie con id ${id}.`);
    }

    return this.toResponse(series);
  }

  async update(id: string, dto: UpdateSeriesDto) {
    const current = await this.prisma.series.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException(`No existe una serie con id ${id}.`);
    }

    const directorIds = dto.directorIds ? this.normalizeIds(dto.directorIds) : undefined;
    if (dto.directorIds && directorIds?.length === 0) {
      throw new BadRequestException('La serie debe tener al menos un director asociado.');
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

  async remove(id: string) {
    const existing = await this.prisma.series.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`No existe una serie con id ${id}.`);
    }

    await this.prisma.series.delete({ where: { id } });
    return { message: 'Serie eliminada correctamente.', id };
  }

  private normalizeIds(ids: string[]) {
    return [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  }

  private async ensureDirectorsExist(ids: string[], tx: Prisma.TransactionClient | PrismaService = this.prisma) {
    const count = await tx.director.count({ where: { id: { in: ids } } });
    if (count !== ids.length) {
      throw new NotFoundException('Uno o más directores enviados no existen.');
    }
  }

  private toResponse(series: Prisma.SeriesGetPayload<{ include: typeof seriesInclude }>) {
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
}
