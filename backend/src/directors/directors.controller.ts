import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { DirectorsService } from './directors.service';

@ApiTags('directors')
@Controller('directors')
export class DirectorsController {
  constructor(private readonly directorsService: DirectorsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un director.' })
  @ApiCreatedResponse({ description: 'Director creado correctamente.' })
  create(@Body() dto: CreateDirectorDto) {
    return this.directorsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar directores con las series donde han participado.' })
  @ApiQuery({ name: 'search', required: false, description: 'Filtro por nombre o nacionalidad.' })
  @ApiOkResponse({ description: 'Listado de directores.' })
  findAll(@Query('search') search?: string) {
    return this.directorsService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar el detalle de un director.' })
  @ApiParam({ name: 'id', description: 'Identificador del director.' })
  findOne(@Param('id') id: string) {
    return this.directorsService.findOne(id);
  }

  @Get(':id/series')
  @ApiOperation({ summary: 'Listar todas las series en las que participó un director.' })
  findSeriesByDirector(@Param('id') id: string) {
    return this.directorsService.findSeriesByDirector(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar información de un director.' })
  update(@Param('id') id: string, @Body() dto: UpdateDirectorDto) {
    return this.directorsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un director.' })
  remove(@Param('id') id: string) {
    return this.directorsService.remove(id);
  }
}
