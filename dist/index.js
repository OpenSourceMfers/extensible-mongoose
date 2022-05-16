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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseExtension = void 0;
const mongoose_1 = require("mongoose");
class DatabaseExtension {
    constructor(mongoDatabase) {
        this.mongoDatabase = mongoDatabase;
    }
    //override me 
    getBindableModels() {
        return [];
    }
    bindModelsToDatabase() {
        for (let def of this.getBindableModels()) {
            this.mongoDatabase.registerModel(def);
        }
    }
}
exports.DatabaseExtension = DatabaseExtension;
class ExtensibleMongooseDatabase {
    constructor() {
        this.mongoose = new mongoose_1.Mongoose();
        this.registeredModels = new Map();
    }
    registerModel(def) {
        let model = this.mongoose.model(def.tableName, def.schema);
        this.registeredModels.set(def.tableName, {
            tableName: def.tableName,
            schema: def.schema,
            model
        });
        return model;
    }
    /*
      Use this method to retrieve models which have been bounded by the additional components
    */
    getModel(def) {
        let registeredModelData = this.registeredModels.get(def.tableName);
        if (!registeredModelData || !registeredModelData.model) {
            throw new Error(`Tried to retrieve unregistered database model: ${def.tableName}`);
        }
        return registeredModelData.model;
    }
    init(dbName, config) {
        return __awaiter(this, void 0, void 0, function* () {
            let host = 'localhost';
            let port = 27017;
            if (config && config.url) {
                host = config.url;
            }
            if (config && config.port) {
                port = config.port;
            }
            if (dbName == null) {
                console.log('WARNING: No dbName Specified');
                process.exit();
            }
            const url = 'mongodb://' + host + ':' + port + '/' + dbName;
            yield this.mongoose.connect(url, {});
            console.log('connected to ', url, dbName);
        });
    }
    dropDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mongoose.connection.db.dropDatabase();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mongoose.disconnect();
        });
    }
}
exports.default = ExtensibleMongooseDatabase;
//# sourceMappingURL=index.js.map