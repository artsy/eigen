import Artist from "../artist"

it("calls pop when done is tapped", () => {
  const navigator: any = { pop: jest.fn() }
  const artist = new Artist({ navigator, route: {} })
  artist.doneTapped()
  expect(navigator.pop).toHaveBeenCalled()
})
