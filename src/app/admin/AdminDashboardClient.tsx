"use client"

import AdminStats from "@/components/admin/AdminStats"
import DoctorsManagement from "@/components/admin/DoctorsManagement"
import RecentAppointment from "@/components/admin/RecentAppointment"
import Navbar from "@/components/Navbar"
import { useGetAppointments } from "@/hooks/useAppointments"
import { useGetDoctors } from "@/hooks/useDoctor"
import { useUser } from "@clerk/nextjs"
import { SettingsIcon } from "lucide-react"

const AdminDashboardClient = () => {

    const { user } = useUser();
    const { data: doctors = [], isLoading: isLoadingDoctors } = useGetDoctors();
    const { data: appointments = [], isLoading: isLoadingAppointments } = useGetAppointments();

    const stats = {
        totalDoctors: doctors.length,
        activeDoctor: doctors.filter((doc) => doc.isActive).length,
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(app => app.status === "COMPLETED").length
    }

    if (isLoadingDoctors || isLoadingAppointments) return
    <div className="flex items-center justify-center w-full h-screen backdrop-blur-2xl bg-background">
        <div className="w-16 h-16 border-b-2 border-primary rounded-full animate-spin"></div>
    </div>;

    return (
        <>
            <div className="min-h-screen bg-background ">
                <Navbar />

                <div className="max-w-7xl mx-auto  px-6 py-8 pt-24">
                    <div className="mb-12 flex items-center justify-between bg-linear-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20">
                        <div className="space-y-4">
                            <div className="inline-flex items-center  gap-2 px-3 py-1 bg-primary/10 rounded-full  border border-primary/20">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <span className="text-sm  font-medium text-primary">Admin Dashboard</span>
                            </div>
                            <div>
                                <h1 className="text-4xl  font-bold mb-2">
                                    Welcome Back {user?.firstName || "Admin"}
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage your dental business with ease.
                                </p>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="w-32 h-32 bg-linear-to-br  from-primary/20 to-primary/10 rounded-full flex  items-center justify-center">
                                <SettingsIcon className="w-16 h-16 text-primary" />
                            </div>
                        </div>
                    </div>

                    <AdminStats
                        totalDoctors={stats.totalDoctors}
                        activeDoctor={stats.activeDoctor}
                        totalAppointments={stats.totalAppointments}
                        completedAppointments={stats.completedAppointments}
                    />

                    <DoctorsManagement />

                    <RecentAppointment/>

                </div>

            </div>
        </>
    )
}

export default AdminDashboardClient