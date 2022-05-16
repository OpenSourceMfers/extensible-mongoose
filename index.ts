
import {
  AnyKeys,
  connect,
  FilterQuery,
  Mongoose,
  Schema,
  Model,
  UpdateQuery,
} from 'mongoose'
 
export interface TableDefinition {
  tableName: string,
  schema: Schema 
}


export interface RegisteredModel extends TableDefinition{
 
  model: Model<any>
} 
  
export class DatabaseExtension {



    constructor(public mongoDatabase:ExtensibleMongooseDatabase){
 
    }


    //override me 
    getBindableModels() : Array<TableDefinition>{

        return []
    }

    bindModelsToDatabase( ){

        for(let def of this.getBindableModels()){
            this.mongoDatabase.registerModel(  def  )
        }

       
    }

}



export default class ExtensibleMongooseDatabase
{   

  mongoose = new Mongoose()


  registeredModels: Map<String,RegisteredModel>

  constructor(){
    this.registeredModels = new Map()
  }


  registerModel( def: TableDefinition ){

      let model = this.mongoose.model<any>(def.tableName,def.schema)

      this.registeredModels.set(def.tableName,{
          tableName: def.tableName,
          schema: def.schema,
          model
      })

      return model

  }

  /*
    Use this method to retrieve models which have been bounded by the additional components 
  */
  getModel( def:TableDefinition ){
    
      let registeredModelData = this.registeredModels.get(def.tableName)
     
      if(!registeredModelData || !registeredModelData.model){
          throw new Error(`Tried to retrieve unregistered database model: ${def.tableName}`)
      }

      return registeredModelData.model
  }



  async init(dbName: string, config?: any) {
      let host = 'localhost'
      let port = 27017

      if (config && config.url) {
      host = config.url
      }
      if (config && config.port) {
      port = config.port
      }

      if (dbName == null) {
      console.log('WARNING: No dbName Specified')
      process.exit()
      }

      const url = 'mongodb://' + host + ':' + port + '/' + dbName
      await this.mongoose.connect(url, {})
      console.log('connected to ', url, dbName)
  }

  async dropDatabase() {
      await this.mongoose.connection.db.dropDatabase()
  }

  async disconnect(){
    await this.mongoose.disconnect()

  }


}