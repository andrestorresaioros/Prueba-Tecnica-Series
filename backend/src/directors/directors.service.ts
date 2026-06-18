import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';

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
} satisfies Prisma.DirectorInclude;

@Injectable()
export class DirectorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDirectorDto) {
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

  async findAll(search?: string) {
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

  async findOne(id: string) {
    const director = await this.prisma.director.findUnique({
      where: { id },
      include: directorInclude,
    });

    if (!director) {
      throw new NotFoundException(`No existe un director con id ${id}.`);
    }

    return this.toResponse(director);
  }

  async findSeriesByDirector(id: string) {
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

  async update(id: string, dto: UpdateDirectorDto) {
    const existing = await this.prisma.director.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`No existe un director con id ${id}.`);
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

  async remove(id: string) {
    const existing = await this.prisma.director.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`No existe un director con id ${id}.`);
    }

    await this.prisma.director.delete({ where: { id } });
    return { message: 'Director eliminado correctamente.', id };
  }

  private toResponse(director: Prisma.DirectorGetPayload<{ include: typeof directorInclude }>) {
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
}
