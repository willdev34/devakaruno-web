import { getPathFunc } from "@/utils/testing"
import { useEffect } from "react"

export const Test = () => {
    useEffect(()=>{
        getPathFunc()
    },[])
    return (
        <></>
    )
}