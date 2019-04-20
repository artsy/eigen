import { Theme } from "@artsy/palette"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { LocationMap } from "../index"

it("looks correct when rendered", () => {
  const comp = renderer.create(
    <Theme>
      <LocationMap {...data as any} />
    </Theme>
  )
  expect(comp).toMatchSnapshot()
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
