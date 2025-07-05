"use client"
import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <>
      Hello World!
      <button onClick={async()=>{
        await signOut()
        console.log('Logout done');
        
        }}>Sign Out</button>
    </>
  );
}
