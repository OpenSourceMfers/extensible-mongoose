import { APICall } from "..";

export default class ApiController  {

 
    ping: APICall =  async (req: any, res: any) => {
         return res.status(200).send('Pong')
    }

}