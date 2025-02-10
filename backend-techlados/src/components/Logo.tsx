import Link from "next/link";

export default function Logo(){
    return(
        <Link href={"/"} className="flex gap-1">
            <img src={"logoNegro.svg"} className="size-6"/>
            <span>TechLados</span>
        </Link>
    )
}