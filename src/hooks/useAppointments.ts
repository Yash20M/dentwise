"use client";

import { bookAppointment, getAppointments, getBookedTimeSlots, getUserAppointments, updateAppointmentStatus } from "@/lib/actions/appointments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAppointments() {
    const result = useQuery({
        queryKey: ["getAppoinments"],
        queryFn: getAppointments,
    })
    return result;
}

export function useBookedTimeSlots(doctorId: string, date: string) {
    const result = useQuery({
        queryKey: ["getBookedTimeSlots"],
        queryFn: () => getBookedTimeSlots(doctorId, date),
        enabled: !!doctorId && !!date
    })
    return result;
}

export function useBookAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bookAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAppoinments"] })
        },
        onError: (err) => console.log(err)
    })
}

export function useUserAppointment() {
    const result = useQuery({
        queryKey: ["getUserAppointment"],
        queryFn: getUserAppointments
    })
    return result;
}

export function useUpdateAppointmentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAppointmentStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAppoinments"] })
        },
        onError: (err) => console.log(err)
    })
}