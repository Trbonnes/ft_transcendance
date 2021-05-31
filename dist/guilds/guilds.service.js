"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildsService = void 0;
const common_1 = require("@nestjs/common");
let GuildsService = class GuildsService {
    create(createGuildDto) {
        return 'This action adds a new guild';
    }
    findAll() {
        return `This action returns all guilds`;
    }
    findOne(id) {
        return `This action returns a #${id} guild`;
    }
    update(id, updateGuildDto) {
        return `This action updates a #${id} guild`;
    }
    remove(id) {
        return `This action removes a #${id} guild`;
    }
};
GuildsService = __decorate([
    common_1.Injectable()
], GuildsService);
exports.GuildsService = GuildsService;
//# sourceMappingURL=guilds.service.js.map