import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "@/models";

export interface IinitialState{
    isLoggedIn:boolean;
    userData:IUser | null
}

const initialState:IinitialState={
 isLoggedIn:false,
 userData:null   
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.isLoggedIn=true;
            state.userData=action.payload
        },
        logout:(state,action)=>{
            state.isLoggedIn=false;
            state.userData=null;
        }
    }
})



export const {login,logout} = userSlice.actions
export default userSlice.reducer;