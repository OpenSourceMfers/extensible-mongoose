"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiController_1 = __importDefault(require("../controllers/apiController"));
const index_1 = __importDefault(require("../index"));
const express_1 = __importDefault(require("express"));
const routes = require('../config/routes.json');
describe('Route Loader', () => {
    it('can load routes', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const apiPort = 4041;
        let controller = new apiController_1.default();
        index_1.default.loadRoutes(app, routes, controller);
        app.listen(apiPort, () => {
            console.log(`API Server listening at http://localhost:${apiPort}`);
        });
    }));
});
//# sourceMappingURL=routeloader.test.js.map