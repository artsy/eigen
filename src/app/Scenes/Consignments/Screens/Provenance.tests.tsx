import { renderWithWrappers } from "app/tests/renderWithWrappers"
import "react-native"
import Provenance from "./Provenance"

const emptyProps = { navigator: {} as any, route: {} as any }

describe("callbacks", () => {
  it("calls pop when done is tapped", () => {
    const navigator: any = { pop: jest.fn() }
    const provenance = new Provenance({ navigator, updateWithProvenance: jest.fn() })

    provenance.doneTapped()

    expect(navigator.pop).toHaveBeenCalled()
  })

  it("calls updateWithProvenance when done is tapped", () => {
    const navigator: any = { pop: jest.fn() }
    const updateWithProvenance = jest.fn()
    const provenance = new Provenance({ navigator, updateWithProvenance })

    provenance.doneTapped()

    expect(updateWithProvenance).toHaveBeenCalled()
  })
})

describe("state", () => {
  it("is set up with empty props", () => {
    const provenance = new Provenance(emptyProps)
    expect(provenance.state).toEqual({ provenance: undefined })
  })

  it("sets new state when text is changed", () => {
    const provenance = new Provenance(emptyProps)
    provenance.setState = jest.fn()

    provenance.textChanged("Acquired by my father somewhere")

    expect(provenance.setState).toHaveBeenCalledWith({
      provenance: "Acquired by my father somewhere",
    })
  })
})

it("renders without throwing a error", () => {
  const nav = {} as any

  renderWithWrappers(<Provenance navigator={nav} />)
})

describe("with an existing state", () => {
  it("renders without throwing a error", () => {
    const nav = {} as any

    renderWithWrappers(<Provenance navigator={nav} provenance="Acquired by my father somewhere" />)
  })
})
