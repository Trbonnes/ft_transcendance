"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGuildDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_guild_dto_1 = require("./create-guild.dto");
class UpdateGuildDto extends mapped_types_1.PartialType(create_guild_dto_1.CreateGuildDto) {
}
exports.UpdateGuildDto = UpdateGuildDto;
//# sourceMappingURL=update-guild.dto.js.map