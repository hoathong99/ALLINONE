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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
var ROLE;
(function (ROLE) {
    ROLE["USER"] = "USER";
    ROLE["ADMIN"] = "ADMIN";
})(ROLE || (ROLE = {}));
let UsersService = class UsersService {
    constructor() {
        this.users = new Map();
        this.findUserUrl = `${process.env.VITE_N8N_URL}/webhook/Login`;
        this.createUserUrl = `${process.env.VITE_N8N_URL}/webhook/createUser`;
    }
    createUser(username, password) {
        // if (this.users.has(username)) {
        //   throw new Error('User already exists');
        // }
        let userInfo = {
            email: username,
            name: "not implemented yet",
            password: password,
            sub: "not implemented yet",
            role: ROLE.USER
        };
        axios_1.default.post(this.createUserUrl, userInfo)
            .then(data => { return data; })
            .catch(error => { throw (error); });
        this.users.set(username, { username, password });
        return { username };
    }
    async findUser(username) {
        try {
            const userInfo = { email: username };
            const response = await axios_1.default.post(this.findUserUrl, userInfo);
            console.log("n8n login:", response);
            if (response) {
                return response.data;
            }
            else {
                return null;
            }
        }
        catch (error) {
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UsersService);
//# sourceMappingURL=users.service.js.map