 
import ExtensibleMongoose from '../index'

 
describe('Extensible Mongoose', () => {
 
  
  
  it('can init', async () => {
 

    let mongoDatabase = new ExtensibleMongoose( )
    await mongoDatabase.init("extensible_mongoose_test") 

    
  })

   

 

 

})
