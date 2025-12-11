import DentalHealhtOverview from "./DentalHealthOverview"
import NextAppointment from "./NextAppointment"

const ActivityOverview = () => {
  return (
    <>
        <div className="grid lg:grid-cols-3 gap-6">
            <DentalHealhtOverview/>
            <NextAppointment/>
        </div>
    </>
  )
}

export default ActivityOverview