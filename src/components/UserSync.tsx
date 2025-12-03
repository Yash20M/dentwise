"use client"

import { syncUser } from "@/lib/actions/users"
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"

const UserSync = () => {
    const { isSignedIn, isLoaded } = useUser()

    useEffect(() => {
        const handleUserSync = async () => {
            try {
                if (isLoaded && isSignedIn) {
                    await syncUser()
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        handleUserSync()
    }, [isLoaded, isSignedIn])
    
    return null
}

export default UserSync