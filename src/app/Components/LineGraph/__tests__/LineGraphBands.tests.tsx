import { fireEvent, screen } from "@testing-library/react-native"
import { LineGraphBands } from "app/Components/LineGraph/LineGraphBands"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe(LineGraphBands, () => {
  const bands = [
    { name: "BandOne", accessibilityLabel: "BandOne" },
    { name: "BandTwo", accessibilityLabel: "BandTwo" },
  ]

  it("renders the bands", async () => {
    const Component = () => <LineGraphBands bands={bands} onBandSelected={jest.fn()} />
    await renderWithWrappers(<Component />)

    expect(await screen.findByText(bands[0].name)).toBeTruthy()
    expect(await screen.findByText(bands[1].name)).toBeTruthy()
  })

  it("onBandSelected callback is fired onPress", async () => {
    const onBandSelected = jest.fn()
    const Component = () => <LineGraphBands bands={bands} onBandSelected={onBandSelected} />
    await renderWithWrappers(<Component />)
    const allTheBands = await screen.findAllByTestId("band")

    await fireEvent(allTheBands[0], "onPress")
    expect(onBandSelected).toHaveBeenCalledWith(bands[0].name)
  })
})
