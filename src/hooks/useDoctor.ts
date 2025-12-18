"use client"

import { createDoctor, getAvailableDoctors, getDoctors, updateDoctor } from "@/lib/actions/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useGetDoctors() {
    const result = useQuery({
        queryKey: ["getDoctors"],
        queryFn: getDoctors
    });

    return result
}

export function useCreateDoctor() {
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn: createDoctor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getDoctors"] }),
        onError: (err) => console.log(err)
    })
    return result
}

export function useUpdateDoctor() {
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn: updateDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getDoctors"] }),
                queryClient.invalidateQueries({ queryKey: ["getAvailableDoctors"] })
        },
        onError: (err) => console.log(err)
    })

    return result;
}

export function useAvailableDoctors() {
    const result = useQuery({
        queryKey: ["getAvailbaleDoctors"],
        queryFn: getAvailableDoctors
    });

    return result;
}