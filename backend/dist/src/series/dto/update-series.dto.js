"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSeriesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_series_dto_1 = require("./create-series.dto");
class UpdateSeriesDto extends (0, swagger_1.PartialType)(create_series_dto_1.CreateSeriesDto) {
}
exports.UpdateSeriesDto = UpdateSeriesDto;
//# sourceMappingURL=update-series.dto.js.map