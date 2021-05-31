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
exports.GuildsController = void 0;
const common_1 = require("@nestjs/common");
const guilds_service_1 = require("./guilds.service");
const create_guild_dto_1 = require("./dto/create-guild.dto");
const update_guild_dto_1 = require("./dto/update-guild.dto");
let GuildsController = class GuildsController {
    constructor(guildsService) {
        this.guildsService = guildsService;
    }
    create(createGuildDto) {
        return this.guildsService.create(createGuildDto);
    }
    findAll() {
        return this.guildsService.findAll();
    }
    findOne(id) {
        return this.guildsService.findOne(+id);
    }
    update(id, updateGuildDto) {
        return this.guildsService.update(+id, updateGuildDto);
    }
    remove(id) {
        return this.guildsService.remove(+id);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_guild_dto_1.CreateGuildDto]),
    __metadata("design:returntype", void 0)
], GuildsController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuildsController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuildsController.prototype, "findOne", null);
__decorate([
    common_1.Patch(':id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_guild_dto_1.UpdateGuildDto]),
    __metadata("design:returntype", void 0)
], GuildsController.prototype, "update", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuildsController.prototype, "remove", null);
GuildsController = __decorate([
    common_1.Controller('guilds'),
    __metadata("design:paramtypes", [guilds_service_1.GuildsService])
], GuildsController);
exports.GuildsController = GuildsController;
//# sourceMappingURL=guilds.controller.js.map