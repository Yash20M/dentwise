"use client"

import BookingConfirmationStep from "@/components/appointments/BookingConfirmationStep";
import DoctorSelectionStep from "@/components/appointments/DoctorSelectionStep";
import ProgressSteps from "@/components/appointments/ProgressSteps";
import TimeSelectionStep from "@/components/appointments/TimeSelectionStep";
import Navbar from "@/components/Navbar";
import { useBookAppointment, useUserAppointment } from "@/hooks/useAppointments";
import { APPOINTMENT_TYPES } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";


const AppointmentPage = () => {
    const [selectedDentistId, setSelectedDentistId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)
    const [bookedAppointment, setBookedAppointment] = useState<any>(null);

    const bookedAppointmentMutation = useBookAppointment()
    const { data: userAppointments = [] } = useUserAppointment()

    const handleSelectDentist = (dentistId: string) => {
        setSelectedDentistId(dentistId);

        setSelectedDate("");
        setSelectedTime("");
        setSelectedType("");
    }

    const handleBookAppointment = async () => {
        if (!selectedDentistId || !selectedDate || !selectedTime) {
            toast.error("Please select a dentist, date, and time");
            return;
        }

        const appointmentType = APPOINTMENT_TYPES.find((typ) => typ.id === selectedType)

        bookedAppointmentMutation.mutate({
            doctorId: selectedDentistId,
            date: selectedDate,
            time: selectedTime,
            reason: appointmentType?.name || "",
        }, {
            onSuccess: async (appointment) => {
                setBookedAppointment(appointment)
                setShowConfirmationModal(true)

                setSelectedDate("")
                setSelectedDentistId(null)
                setSelectedTime("")
                setSelectedType("")
                setCurrentStep(1)
            },
            onError: (error) => toast.error(error.message)

        }
        )
    }

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8  pt-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold  mb-2">Book an Appointment</h1>
                    <p className="text-muted-foreground">Find and book an appointment with a verified dentist</p>
                </div>

                <ProgressSteps currentStep={currentStep} />

                {currentStep === 1 && (
                    <DoctorSelectionStep
                        selectedDentistId={selectedDentistId}
                        onContinue={() => setCurrentStep(2)}
                        onSelectDentist={handleSelectDentist}
                    />
                )}

                {currentStep === 2 && selectedDentistId && (
                    <TimeSelectionStep
                        selectedDentistId={selectedDentistId}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        selectedType={selectedType}
                        onBack={() => setCurrentStep(1)}
                        onContinue={() => setCurrentStep(3)}
                        onDateChange={setSelectedDate}
                        onTimeChange={setSelectedTime}
                        onTypeChange={setSelectedType}
                    />
                )}

                {currentStep === 3 && selectedDentistId && (
                    <BookingConfirmationStep
                        selectedDentistId={selectedDentistId}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        selectedType={selectedType}
                        isBooking={bookedAppointmentMutation.isPending}
                        onBack={() => setCurrentStep(2)}
                        onModify={() => setCurrentStep(2)}
                        onConfirm={handleBookAppointment}

                    />
                )}
            </div>

            {
                userAppointments.length > 0 && (
                    <div className="mb-8  max-w-7xl mx-auto px-6 py-8 ">
                        <h2 className="text-xl font-semibold mb-4">Your Upcoming Appointments</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {userAppointments.map((appointment) => (
                                <div key={appointment.id} className="bg-card border rounded-lg  p-4 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <img
                                                src={appointment.doctorImageUrl}
                                                alt={appointment.doctorName}
                                                className="size-10 rounded-full"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{appointment.doctorName}</p>
                                            <p className="text-muted-foreground text-xs">{appointment.reason}</p>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <p className="text-muted-foreground">
                                                {format(new Date(appointment.date), "MMM d, yyyy")}
                                            </p>
                                            <p className="text-muted-foreground">🕒 {appointment.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default AppointmentPage;