"use server"

import { Gender } from "@/generated/enums"
import { revalidatePath } from "next/cache"
import { prisma } from "../prisma"
import { generateAvatar } from "../utils"

interface CreateDoctorInput {
    name: string,
    email: string,
    phone: string,
    speciality: string,
    gender: Gender,
    isActive: boolean
}

interface UpdateDoctorInput extends Partial<CreateDoctorInput> {
    id: string
}

export async function getDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                _count: { select: { appointments: true } }
            },
            orderBy: { createdAt: "desc" }
        })
        return doctors.map((doc) => ({
            ...doc,
            appointmentCount: doc._count.appointments
        }))
    }
    catch (err) {
        console.log(err)
    }
}



export async function createDoctor(input: CreateDoctorInput) {
    try {
        if (!input.name || !input.email) throw new Error("Name and email are required");

        const doctor = await prisma.doctor.create({
            data: {
                ...input,
                imageUrl: generateAvatar(input.name, input.gender)
            }
        })

        revalidatePath("/admin")
    }
    catch (err: any) {
        console.log(err)

        if (err?.code === "P2002") throw new Error("Email already exists");
    }
}

export async function updateDoctor(input: UpdateDoctorInput) {
    try {
        if (!input.name || !input.email) {
            throw new Error("Name and email are required");
        }

        const currentDoctor = await prisma.doctor.findUnique({
            where: { id: input.id },
            select: { email: true }
        })

        if (!currentDoctor) throw new Error("Doctor not found");

        if (input.email !== currentDoctor.email) {
            throw new Error("Email already exists");
        }

        const doctor = await prisma.doctor.update({
            where: { id: input.id },
            data: {
                name: input.name,
                email: input.email,
                phone: input.phone,
                speciality: input.speciality,
                gender: input.gender,
                isActive: input.isActive
            }
        })

        return doctor;
    }
    catch (err: any) {
        console.log(err)
    }

}

export async function getAvailableDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { appointments: true }
                }
            },
            orderBy: { name: "asc" }
        });

        return doctors.map((doc) => ({
            ...doc,
            appointmentCount: doc._count.appointments
        }))
    }
    catch (err) {
        console.log(err)
        throw new Error("Failed to fetch available doctors");
    }
}