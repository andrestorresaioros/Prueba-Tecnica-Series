import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 'P2002') {
      const error = new ConflictException('Ya existe un registro con los datos únicos enviados.');
      return response.status(error.getStatus()).json(error.getResponse());
    }

    if (exception.code === 'P2025') {
      const error = new NotFoundException('No se encontró el recurso solicitado.');
      return response.status(error.getStatus()).json(error.getResponse());
    }

    return response.status(400).json({
      statusCode: 400,
      message: 'Error de persistencia de datos.',
      code: exception.code,
    });
  }
}
