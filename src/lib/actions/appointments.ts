"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { AppointmentStatus } from "@/generated/enums";

interface BookAppointmentInput {
    doctorId: string;
    date: string;
    time: string;
    reason?: string,
}

const transformApointment = (appointment: any) => {
    return {
        ...appointment,
        patientName: `${appointment?.user?.firstName || ""} ${appointment?.user?.lastName || ""}`,
        patientEmail: appointment?.user?.email,
        doctorName: appointment.doctor?.name || "",
        doctorImageUrl: appointment.doctor?.imageUrl || "",
        date: appointment?.date?.toISOString().split("T")[0]
    }
}

export async function getAppointments() {
    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                status: {
                    in: ["CONFIRMED", "COMPLETED"]
                }
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                doctor: {
                    select: {
                        name: true,
                        imageUrl: true
                    }
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return appointments.map((app) => transformApointment(app))
    }
    catch (err) {
        console.log(err)
    }
}

export async function getUserAppointmentStats() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("User must be authenticated");

        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        });

        if (!user) throw new Error("User not found");

        const [totalCount, completeCount] = await Promise.all([
            prisma.appointment.count({
                where: { 
                    userId: user.id,
                    status: {
                        in: ["CONFIRMED", "COMPLETED"]
                    }
                }
            }),
            prisma.appointment.count({
                where: {
                    userId: user.id,
                    status: "COMPLETED"
                }
            })
        ])

        return {
            totalAppointments: totalCount,
            completedAppointments: completeCount,
        }

    }
    catch (err) {
        console.log(err)
        return {
            totalAppointments: 0,
            completedAppointments: 0,
        }
    }
}

export async function getUserAppointments() {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("User must be authenticated");

        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        });

        if (!user) throw new Error("User not found");

        const appointments = await prisma?.appointment.findMany({
            where: { 
                userId: user.id,
                status: {
                    in: ["CONFIRMED", "COMPLETED"]
                }
            },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                doctor: {
                    select: {
                        name: true, imageUrl: true
                    }
                },
            },
            orderBy: [{ date: "asc" }, { time: "asc" }]
        })
        return appointments.map((appointment) => transformApointment(appointment));
    }
    catch (err) {
        console.log(err);
    }
}

export async function getBookedTimeSlots(doctorId: string, date: string) {
    try {
        const appointements = await prisma.appointment.findMany({
            where: {
                doctorId,
                date: new Date(date),
                status: {
                    in: ["CONFIRMED", "COMPLETED"]
                }
            },
            select: { time: true }
        })

        return appointements.map((appointment) => appointment.time);

    } catch (error) {
        console.log(error);
        return []
    }
}

export async function bookAppointment(input: BookAppointmentInput) {
    try {
        const { userId } = await auth();

        if (!userId) throw new Error("You must be Logged In to book an appointment");

        if (!input.doctorId || !input.date || !input.time) throw new Error("Doctor , Date and Time are required");

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) throw new Error("Account not found. Please ensure your account is properly set");

        const appointment = await prisma.appointment.create({
            data: {
                userId: user.id,
                doctorId: input.doctorId,
                date: new Date(input.date),
                time: input.time,
                reason: input.reason || "General consultation",
                status: "CONFIRMED"
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                doctor: {
                    select: {
                        name: true,
                        imageUrl: true
                    }
                }
            }
        })

        return transformApointment(appointment);
    }
    catch (error) {
        console.log(error);
    }
}

export async function updateAppointmentStatus(input: { id: string, status: AppointmentStatus }) {
    try {
        const appointment = await prisma.appointment.update({
            where: { id: input.id },
            data: { status: input.status }
        })

        return appointment
    } catch (err) {
        console.log(err);
    }
}