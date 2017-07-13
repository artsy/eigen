import Artist from "../Artist"

const emptyProps = { navigator: {} as any, route: {} as any }

describe("callbacks", () => {
  it("calls pop when done is tapped", () => {
    const navigator: any = { pop: jest.fn() }
    const artist = new Artist({ navigator, route: {} })
    artist.doneTapped()
    expect(navigator.pop).toHaveBeenCalled()
  })

  it("calls nav.pop & updateWithResult when a result is tapped", () => {
    const navigator: any = { pop: jest.fn() }
    const updateWithResult = jest.fn()
    const artist = new Artist({ navigator, route: {}, updateWithResult })

    artist.artistSelected({} as any)

    expect(navigator.pop).toHaveBeenCalled()
    expect(updateWithResult).toHaveBeenCalled()
  })
})

describe("state", () => {
  it("is set up with empty props", () => {
    const artist = new Artist(emptyProps)
    expect(artist.state).toEqual({ query: null, searching: false, results: null })
  })

  it("is set up with empty props", () => {
    const artist = new Artist(emptyProps)
    expect(artist.state).toEqual({ query: null, searching: false, results: null })
  })

  it("sets new state when text is changed", () => {
    const artist = new Artist(emptyProps)
    artist.setState = jest.fn()
    artist.searchForQuery = jest.fn()

    artist.textChanged("Blu")

    expect(artist.setState).toHaveBeenCalledWith({ query: "Blu", searching: true })
    expect(artist.searchForQuery).toHaveBeenCalledWith("Blu")
  })
})
