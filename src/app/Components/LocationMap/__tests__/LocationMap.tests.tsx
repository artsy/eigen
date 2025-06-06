import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"
import { LocationMap } from "app/Components/LocationMap/LocationMap"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<LocationMap {...(data as any)} />)
})

const data = {
  location: {
    gravityID: "123",
    id: "52b0ced8cd530ed44400014f",
    city: "New York",
    address: "25 Central Park West",
    address_2: "",
    display: "",
    coordinates: { lat: 40.770424, lng: -73.981233 },
    day_schedules: [
      { start_time: 36000, end_time: 64800, day_of_week: "Monday" },
      { start_time: 36000, end_time: 64800, day_of_week: "Tuesday" },
      { start_time: 36000, end_time: 64800, day_of_week: "Wednesday" },
      { start_time: 36000, end_time: 64800, day_of_week: "Thursday" },
      { start_time: 36000, end_time: 64800, day_of_week: "Friday" },
    ],
  },
  partnerName: "Joseph K. Levene Fine Art, Ltd.",
}
