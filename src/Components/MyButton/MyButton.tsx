import { Button } from "@/components/ui/button"

export default function MyButton({variant="outline",text,onClick}:{variant:"outline" | "link" | "default" | "destructive" | "secondary" | "ghost",text:string,onClick:any}){
    return (
        <>
            <Button variant={variant} onClick={onClick}>{text}</Button>
        </>
    )
}