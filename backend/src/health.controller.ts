import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({ description: 'Servicio disponible.' })
  health() {
    return {
      status: 'ok',
      service: 'oati-series-directors-api',
      timestamp: new Date().toISOString(),
    };
  }
}
