import { useAvailableDoctors } from '@/hooks/useDoctor'
import Image from 'next/image';
import React from 'react'

const DoctorInfo = ({ doctorId }: { doctorId: string }) => {
    const { data: doctors = [] } = useAvailableDoctors();
    const doctor = doctors.find((doc) => doc.id === doctorId);

    if(!doctor){
        return null
    }


    return (
        <>
            <div className='flex  items-center gap-4'>
                <Image
                    src={doctor.imageUrl!}
                    alt={doctor.name!}
                    loading='lazy'
                    width={48}
                    height={48}
                    className='w-12 h-12 rounded-full object-cover'
                />
                <div>
                    <h3 className='font-medium'>{doctor.name}</h3>
                    <p className='text-sm text-muted-foreground'>{doctor?.speciality || "General Dentist" }</p>
                </div>
            </div>
        </>
    )
}

export default DoctorInfo