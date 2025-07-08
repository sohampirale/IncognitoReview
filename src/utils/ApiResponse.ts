export interface IApiResponse{
    success:boolean,
    message:string,
    data?:any,
    error?:any,
    code?:string
}

export class ApiResponse implements IApiResponse{
    success:boolean;
    message:string;
    data?:any;
    error?:any;
    isVerified?: boolean;
    code?:string;

    constructor(success:boolean,message:string,data?:any,error?:any,code?:string){
        this.success=success;
        this.message=message;
        if(data)
            this.data=data;

        if(error)
            this.error=error

        if(code)
            this.code=code;
    }   
}

