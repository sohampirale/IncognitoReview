import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MyAvatar({src="",fallback,onClick}:{src:string,fallback:string,onClick?:any}){
    return (
        <>
            <Avatar onClick={onClick}>
                <AvatarImage src={src} />
                <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
        </>
    )
}