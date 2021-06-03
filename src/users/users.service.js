"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var UsersService = /** @class */ (function () {
    function UsersService() {
    }
    UsersService.prototype.create = function (createUserDto) {
        return 'This action adds a new user';
    };
    UsersService.prototype.findAll = function () {
        return "This action returns all users";
    };
    UsersService.prototype.findOne = function (id) {
        return "This action returns a #" + id + " user";
    };
    UsersService.prototype.update = function (id, updateUserDto) {
        return "This action updates a #" + id + " user";
    };
    UsersService.prototype.remove = function (id) {
        return "This action removes a #" + id + " user";
    };
    UsersService = __decorate([
        common_1.Injectable()
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
