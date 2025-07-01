export interface IApiResponse{
    success:boolean,
    message:string,
    data?:any,
    error?:any
}

export class ApiResponse implements IApiResponse{
    success:boolean;
    message:string;
    data?:any;
    error?:any;
    isVerified?: boolean;

    constructor(success:boolean,message:string,data?:any,error?:any){
        this.success=success;
        this.message=message;
        if(data)
            this.data=data;

        if(error)
            this.error=error
    }
}

