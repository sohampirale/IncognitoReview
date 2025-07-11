class DBError extends Error{
    statusCode:number;
    error?:unknown

    constructor(statusCode:number,message:string,error?:unknown){
        super("DB Error :: "+message)
        this.statusCode=statusCode;
        this.error=error;
    }

}

export default DBError