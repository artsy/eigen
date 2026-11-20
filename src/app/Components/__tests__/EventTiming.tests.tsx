import { screen } from "@testing-library/react-native"
import { EventTiming } from "app/Components/EventTiming"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const currentTime = "2018-05-10T20:22:32.000Z"

it("returns 'Closed' if the event is over", async () => {
  await renderWithWrappers(
    <EventTiming
      startAt="2018-05-01T10:24:31+00:00"
      currentTime={currentTime}
      endAt="2018-05-08T10:24:31+00:00"
    />
  )
  expect(screen.getByText("Closed")).toBeOnTheScreen()
})

it("returns a count of days if the event is closing soon", async () => {
  await renderWithWrappers(
    <EventTiming
      startAt="2018-05-01T10:24:31+00:00"
      currentTime={currentTime}
      endAt="2018-05-12T10:24:31+00:00"
    />
  )
  expect(screen.getByText("Closes in 2 days")).toBeOnTheScreen()
})

it("returns a countdown if the event ends within 24 hours", async () => {
  await renderWithWrappers(
    <EventTiming
      startAt="2018-05-01T10:24:31+00:00"
      currentTime={currentTime}
      endAt="2018-05-10T23:24:31+00:00"
    />
  )
  expect(screen.getByText("Closes in 03 : 01 : 59")).toBeOnTheScreen()
})
