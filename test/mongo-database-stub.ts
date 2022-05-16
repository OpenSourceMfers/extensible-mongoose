 
import { AnyKeys, FilterQuery, Model, Schema, UpdateQuery } from 'mongoose'
import ExtensibleMongooseDatabase, { TableDefinition } from '..'

class StubbedModel extends Model<any>{
  dataStore: any[]

  constructor(public tableName: string, public schema: Schema) {
    super()
    this.dataStore = []
  }

  async create(inputData: any): Promise<any> {
    this.dataStore.push(inputData)

    return inputData
  }

  async insertMany(inputs: any[]): Promise<any> {
    inputs.map((i) => this.create(i))
  }

  async find(filter: any): Promise<any[]> {
    const keys = Object.keys(filter)
    const values = Object.values(filter)

    return this.dataStore.filter((element) => {
      //we make sure all the keys match up properly

      for (let i = 0; i < keys.length; i++) {
        if (element[keys[i]] != values[i]) {
          return false
        }
      }

      return true
    })
  }

  async findOne(filter: any): Promise<any> {
    const allResults = await this.find(filter)

    if (allResults && allResults.length > 0) {
      return allResults[0]
    }

    return undefined
  }
}

export default class MongoDatabaseStub extends ExtensibleMongooseDatabase {
 
  stubbedModels = new Map<String,StubbedModel>()

  //stubbed
  getModel( def:TableDefinition ) : Model<any>{

    let tableName = def.tableName

    let model: StubbedModel ;


    if(this.stubbedModels.has(tableName)){
      model = this.stubbedModels.get(tableName)!
    }else{
      model = new StubbedModel(tableName, def.schema)
      this.stubbedModels.set(tableName, model)
    }
    
    // @ts-ignore
    return model
}



}
