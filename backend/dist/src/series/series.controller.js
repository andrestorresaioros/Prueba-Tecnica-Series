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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_series_dto_1 = require("./dto/create-series.dto");
const update_series_dto_1 = require("./dto/update-series.dto");
const series_service_1 = require("./series.service");
let SeriesController = class SeriesController {
    constructor(seriesService) {
        this.seriesService = seriesService;
    }
    create(dto) {
        return this.seriesService.create(dto);
    }
    findAll(search) {
        return this.seriesService.findAll(search);
    }
    findOne(id) {
        return this.seriesService.findOne(id);
    }
    update(id, dto) {
        return this.seriesService.update(id, dto);
    }
    remove(id) {
        return this.seriesService.remove(id);
    }
};
exports.SeriesController = SeriesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar una serie y asociarla a uno o varios directores.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Serie creada correctamente.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_series_dto_1.CreateSeriesDto]),
    __metadata("design:returntype", void 0)
], SeriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar series con su información y directores.' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Filtro por nombre, país o director.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Listado de series.' }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Consultar el detalle de una serie.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identificador de la serie.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modificar la información de una serie y/o sus directores.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_series_dto_1.UpdateSeriesDto]),
    __metadata("design:returntype", void 0)
], SeriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una serie.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeriesController.prototype, "remove", null);
exports.SeriesController = SeriesController = __decorate([
    (0, swagger_1.ApiTags)('series'),
    (0, common_1.Controller)('series'),
    __metadata("design:paramtypes", [series_service_1.SeriesService])
], SeriesController);
//# sourceMappingURL=series.controller.js.map