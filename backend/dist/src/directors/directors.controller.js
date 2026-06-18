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
exports.DirectorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_director_dto_1 = require("./dto/create-director.dto");
const update_director_dto_1 = require("./dto/update-director.dto");
const directors_service_1 = require("./directors.service");
let DirectorsController = class DirectorsController {
    constructor(directorsService) {
        this.directorsService = directorsService;
    }
    create(dto) {
        return this.directorsService.create(dto);
    }
    findAll(search) {
        return this.directorsService.findAll(search);
    }
    findOne(id) {
        return this.directorsService.findOne(id);
    }
    findSeriesByDirector(id) {
        return this.directorsService.findSeriesByDirector(id);
    }
    update(id, dto) {
        return this.directorsService.update(id, dto);
    }
    remove(id) {
        return this.directorsService.remove(id);
    }
};
exports.DirectorsController = DirectorsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un director.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Director creado correctamente.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_director_dto_1.CreateDirectorDto]),
    __metadata("design:returntype", void 0)
], DirectorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar directores con las series donde han participado.' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Filtro por nombre o nacionalidad.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Listado de directores.' }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DirectorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Consultar el detalle de un director.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identificador del director.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DirectorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/series'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las series en las que participó un director.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DirectorsController.prototype, "findSeriesByDirector", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modificar información de un director.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_director_dto_1.UpdateDirectorDto]),
    __metadata("design:returntype", void 0)
], DirectorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un director.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DirectorsController.prototype, "remove", null);
exports.DirectorsController = DirectorsController = __decorate([
    (0, swagger_1.ApiTags)('directors'),
    (0, common_1.Controller)('directors'),
    __metadata("design:paramtypes", [directors_service_1.DirectorsService])
], DirectorsController);
//# sourceMappingURL=directors.controller.js.map