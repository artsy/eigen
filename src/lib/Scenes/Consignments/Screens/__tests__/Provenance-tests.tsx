import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import Provenance from "../Provenance"

import { Theme } from "@artsy/palette"

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

    expect(provenance.setState).toHaveBeenCalledWith({ provenance: "Acquired by my father somewhere" })
  })
})

it("renders without throwing a error", () => {
  const nav = {} as any
  const route = {} as any

  renderWithWrappers(
    <Theme>
      <Provenance navigator={nav} route={route} />
    </Theme>
  )
})

describe("with an existing state", () => {
  it("renders without throwing a error", () => {
    const nav = {} as any
    const route = {} as any

    renderWithWrappers(
      <Theme>
        <Provenance navigator={nav} route={route} provenance="Acquired by my father somewhere" />
      </Theme>
    )
  })
})
