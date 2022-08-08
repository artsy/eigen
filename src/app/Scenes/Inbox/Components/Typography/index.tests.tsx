import { render } from "@testing-library/react-native"
import { Subtitle } from "./"

it("passes on props to subtitle", () => {
  const { getByText } = render(
    <Subtitle numberOfLines={1} ellipsizeMode="middle">
      My Subtitle
    </Subtitle>
  )
  expect(getByText(/My Subtitle/)).toHaveProp("numberOfLines", 1)
  expect(getByText(/My Subtitle/)).toHaveProp("ellipsizeMode", "middle")
})
