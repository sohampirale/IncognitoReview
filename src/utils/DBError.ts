class DBError extends Error{
    statusCode:Number;
    error?:any

    constructor(statusCode:number,message:string,error?:any){
        super("DB Error :: "+message)
        this.statusCode=statusCode;
        this.error=error;
    }

}

export default DBError