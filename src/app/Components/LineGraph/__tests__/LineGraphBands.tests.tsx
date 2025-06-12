import { fireEvent } from "@testing-library/react-native"
import { LineGraphBands } from "app/Components/LineGraph/LineGraphBands"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe(LineGraphBands, () => {
  const bands = [
    { name: "BandOne", accessibilityLabel: "BandOne" },
    { name: "BandTwo", accessibilityLabel: "BandTwo" },
  ]

  it("renders the bands", async () => {
    const Component = () => <LineGraphBands bands={bands} onBandSelected={jest.fn()} />
    const { findByText } = renderWithWrappers(<Component />)

    expect(await findByText(bands[0].name)).toBeTruthy()
    expect(await findByText(bands[1].name)).toBeTruthy()
  })

  it("onBandSelected callback is fired onPress", async () => {
    const onBandSelected = jest.fn()
    const Component = () => <LineGraphBands bands={bands} onBandSelected={onBandSelected} />
    const { findAllByTestId } = renderWithWrappers(<Component />)
    const allTheBands = await findAllByTestId("band")

    fireEvent(allTheBands[0], "onPress")
    expect(onBandSelected).toHaveBeenCalledWith(bands[0].name)
  })
})
