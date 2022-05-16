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
const mongoose_1 = require("mongoose");
const index_1 = __importDefault(require("../index"));
class StubbedModel extends mongoose_1.Model {
    constructor(tableName, schema) {
        super();
        this.tableName = tableName;
        this.schema = schema;
        this.dataStore = [];
    }
    create(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dataStore.push(inputData);
            return inputData;
        });
    }
    insertMany(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            inputs.map((i) => this.create(i));
        });
    }
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(filter);
            const values = Object.values(filter);
            return this.dataStore.filter((element) => {
                //we make sure all the keys match up properly
                for (let i = 0; i < keys.length; i++) {
                    if (element[keys[i]] != values[i]) {
                        return false;
                    }
                }
                return true;
            });
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const allResults = yield this.find(filter);
            if (allResults && allResults.length > 0) {
                return allResults[0];
            }
            return undefined;
        });
    }
}
class MongoDatabaseStub extends index_1.default {
    constructor() {
        super(...arguments);
        this.stubbedModels = new Map();
    }
    //stubbed
    getModel(def) {
        let tableName = def.tableName;
        let model;
        if (this.stubbedModels.has(tableName)) {
            model = this.stubbedModels.get(tableName);
        }
        else {
            model = new StubbedModel(tableName, def.schema);
            this.stubbedModels.set(tableName, model);
        }
        // @ts-ignore
        return model;
    }
}
exports.default = MongoDatabaseStub;
//# sourceMappingURL=mongo-database-stub.js.map