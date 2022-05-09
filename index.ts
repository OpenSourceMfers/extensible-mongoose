
import {
  AnyKeys,
  connect,
  FilterQuery,
  Mongoose,
  Schema,
  Model,
  UpdateQuery,
} from 'mongoose'
import { register } from 'ts-node'
import { InterfaceType, Type } from 'typescript'



export interface RegisteredModel {
  tableName: string,
  schema: Schema,
  model?: Model<any>
}

 
  
export class DatabaseExtension {



    constructor(public mongoDatabase:ExtensibleMongooseDatabase){
 
    }


    //override me 
    getBindableModels() : Array<RegisteredModel>{

        return []
    }

    bindModelsToDatabase( ){

        for(let model of this.getBindableModels()){
            this.mongoDatabase.registerModel( model.tableName, model.schema )
        }

       
    }

}



export default class ExtensibleMongooseDatabase
{   

  mongoose = new Mongoose()


  registeredModels: Map<string,RegisteredModel>

  constructor(){
    this.registeredModels = new Map()
  }


  registerModel( tableName:string, schema:Schema){

      let model = this.mongoose.model<any>(tableName,schema)

      this.registeredModels.set(tableName,{
          tableName,
          schema,
          model
      })

      return model

  }

  /*
    Use this method to retrieve models which have been bounded by the additional components 
  */
  getModel( tableName:string ){
      let registeredModelData = this.registeredModels.get(tableName)

      if(!registeredModelData || !registeredModelData.model){
          throw new Error(`Tried to retrieve unregistered database model: ${tableName}`)
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


}