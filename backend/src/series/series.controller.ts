import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { SeriesService } from './series.service';

@ApiTags('series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una serie y asociarla a uno o varios directores.' })
  @ApiCreatedResponse({ description: 'Serie creada correctamente.' })
  create(@Body() dto: CreateSeriesDto) {
    return this.seriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar series con su información y directores.' })
  @ApiQuery({ name: 'search', required: false, description: 'Filtro por nombre, país o director.' })
  @ApiOkResponse({ description: 'Listado de series.' })
  findAll(@Query('search') search?: string) {
    return this.seriesService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar el detalle de una serie.' })
  @ApiParam({ name: 'id', description: 'Identificador de la serie.' })
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar la información de una serie y/o sus directores.' })
  update(@Param('id') id: string, @Body() dto: UpdateSeriesDto) {
    return this.seriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una serie.' })
  remove(@Param('id') id: string) {
    return this.seriesService.remove(id);
  }
}
