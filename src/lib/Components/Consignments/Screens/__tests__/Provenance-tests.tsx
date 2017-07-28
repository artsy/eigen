import Provenance from "../Provenance"

const emptyProps = { navigator: {} as any, route: {} as any }

describe("callbacks", () => {
  it("calls pop when done is tapped", () => {
    const navigator: any = { pop: jest.fn() }
    const provenance = new Provenance({ navigator, route: {}, updateWithProvenance: jest.fn() })

    provenance.doneTapped()

    expect(navigator.pop).toHaveBeenCalled()
  })

  it("calls updateWithProvenance when done is tapped", () => {
    const navigator: any = { pop: jest.fn() }
    const updateWithProvenance = jest.fn()
    const provenance = new Provenance({ navigator, route: {}, updateWithProvenance })
    provenance.setState({ provenance: "Acquired by my father somewhere" })

    provenance.doneTapped()

    expect(updateWithProvenance).toHaveBeenCalled()
  })
})

describe("state", () => {
  it("is set up with empty props", () => {
    const provenance = new Provenance(emptyProps)
    expect(provenance.state).toEqual({ provenance: null })
  })

  it("sets new state when text is changed", () => {
    const provenance = new Provenance(emptyProps)
    provenance.setState = jest.fn()

    provenance.textChanged("Acquired by my father somewhere")

    expect(provenance.setState).toHaveBeenCalledWith({ provenance: "Acquired by my father somewhere" })
  })
})
