import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"
import { EventTiming } from "app/Components/EventTiming"

const currentTime = "2018-05-10T20:22:32.000Z"

it("returns 'Closed' if the event is over", () => {
  const tree = renderWithWrappersLEGACY(
    <EventTiming
      startAt="2018-05-01T10:24:31+00:00"
      currentTime={currentTime}
      endAt="2018-05-08T10:24:31+00:00"
    />
  )
  expect(extractText(tree.root)).toMatch("Closed")
})

it("returns a count of days if the event is closing soon", () => {
  const tree = renderWithWrappersLEGACY(
    <EventTiming
      startAt="2018-05-01T10:24:31+00:00"
      currentTime={currentTime}
      endAt="2018-05-12T10:24:31+00:00"
    />
  )
  expect(extractText(tree.root)).toMatch("Closes in 2 days")
})

it("returns a countdown if the event ends within 24 hours", () => {
  const tree = renderWithWrappersLEGACY(
    <EventTiming
      startAt="2018-05-01T10:24:31+00:00"
      currentTime={currentTime}
      endAt="2018-05-10T23:24:31+00:00"
    />
  )
  expect(extractText(tree.root)).toMatch("Closes in 03 : 01 : 59")
})
