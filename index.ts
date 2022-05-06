


export type APICall = (req: any, res: any) => any

export interface Route {
  type:string,
  uri: string,
  method: string,
  controller?: string
  appendParams?: any
}


export interface Config {
  verboseLogging: boolean,
  successCode: number,
  failureCode: number
}


const configDefaults: Config = {
  verboseLogging:false,
  successCode: 200,
  failureCode: 401 
}


export default class DegenRouteLoader {


   config:Config


   constructor(conf: Config) {
      this.config = { ...configDefaults, ...conf };
  }
 

  loadRoutes(expressApp: any, routesConfig: Array<Route>, controllerClass: any) {
    for (const route of routesConfig) {
      this.configureRoute(expressApp, route, controllerClass)
    }
  }

  configureRoute(expressApp: any, route: Route, controllerClass: any) {
    
    if(this.config.verboseLogging){
      console.log('configuring route', route)
    }
    
    let restAction: string = route.type 
    let endpointURI: string = route.uri
    let methodName: string = route.method 
    let appendParams: any = route.appendParams ? JSON.parse(JSON.stringify( route.appendParams )) : undefined

    if (typeof endpointURI != 'string' ) {
      throw 'Error: invalid route format for endpointURI'
    }

    if (typeof methodName != 'string') {
      throw 'Error: invalid route format for methodName'
    } 

    if (typeof restAction != 'string') {
      throw 'Error: invalid route format for restAction'
    }

    restAction = restAction.toLowerCase()

    if (restAction == 'get') {
      expressApp.get(endpointURI, async (req: any, res: any) => {
        req = DegenRouteLoader.appendParams(req, appendParams)


        let response = await controllerClass[methodName](req)


        res.send(response.statusCode)
      })
    }

    if (restAction == 'post') {
      expressApp.post(endpointURI, async (req: any, res: any) => {
        req = DegenRouteLoader.appendParams(req, appendParams)
        return await controllerClass[methodName](req, res)
      })
    }
  }

  static appendParams(req:any, appendParams: any){

    if(appendParams){
      return Object.assign( req , {router: { params: appendParams }})
    }

    return Object.assign( req , {router: { params: {}  }}) 

  }

}
