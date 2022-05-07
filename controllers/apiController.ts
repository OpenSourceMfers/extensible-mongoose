import { ControllerMethod } from "..";

export default class ApiController  {

 
    ping: ControllerMethod =  async (req: any)  => {
         return {success:true, data:'pong'}
    }

}