import { config, expect, should } from 'chai'
import ApiController from '../controllers/apiController'
 

import DegenRouteLoader, { Config, Route } from '../index'

 
import express from 'express'

const routes = require('../config/routes.json')


describe('Route Loader', () => {
 
  
  
  it('can load routes', async () => {

    const app = express()

    const apiPort = 4041

    let controller = new ApiController()

 

    let degenRouteLoader = new DegenRouteLoader( )

    degenRouteLoader.loadRoutes( app, routes, controller)

    app.listen(apiPort, () => {
      console.log(`API Server listening at http://localhost:${apiPort}`)
    })

    
  })

   

 

 

})
