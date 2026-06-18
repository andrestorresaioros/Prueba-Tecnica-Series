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
exports.CreateSeriesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateSeriesDto {
}
exports.CreateSeriesDto = CreateSeriesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Breaking Bad' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 120),
    __metadata("design:type", String)
], CreateSeriesDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2008-01-20' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSeriesDto.prototype, "releaseDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Un profesor de química entra en el mundo criminal.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 1000),
    __metadata("design:type", String)
], CreateSeriesDto.prototype, "synopsis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Estados Unidos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 80),
    __metadata("design:type", String)
], CreateSeriesDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5, minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateSeriesDto.prototype, "seasons", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 9.5, minimum: 0, maximum: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 1 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateSeriesDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.SeriesStatus, example: client_1.SeriesStatus.FINISHED }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SeriesStatus),
    __metadata("design:type", String)
], CreateSeriesDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identificadores de directores asociados a la serie.',
        example: ['clx-director-id-1', 'clx-director-id-2'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSeriesDto.prototype, "directorIds", void 0);
//# sourceMappingURL=create-series.dto.js.map