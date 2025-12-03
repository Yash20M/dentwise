"use server";

import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "../prisma";

export async function syncUser() {
    try {
        const user = await currentUser();

        if (!user) return;

        const exisitingUser = await prisma.user.findUnique({
            where: { clerkId: user.id }
        })

        if (exisitingUser) return exisitingUser;

        const dbUser = await prisma.user.create({
            data: {
                clerkId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0].emailAddress,
                phone: user?.phoneNumbers[0]?.phoneNumber || "",

            }
        })

        return dbUser;
    }
    catch (err) {
        console.log(err)
    }
}





