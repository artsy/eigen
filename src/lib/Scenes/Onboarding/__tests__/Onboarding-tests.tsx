import { extractText } from "lib/tests/extractText"
import React from "react"
import { __globalStoreTestUtils__ } from "../../../store/GlobalStore"
import { renderWithWrappers } from "../../../tests/renderWithWrappers"
import { LogIn } from "../OldLogin/LogIn"
import { Onboarding } from "../Onboarding"

describe("Onboarding", () => {
  it("uses the old flow when ARUseNewOnboarding is set to false", () => {
    const tree = renderWithWrappers(<Onboarding />)

    __globalStoreTestUtils__?.injectFeatureFlags({ ARUseNewOnboarding: false })

    expect(tree.root.findAllByType(LogIn).length).toEqual(1)
    expect(extractText(tree.root)).not.toContain("Onbording")
  })

  it("uses the new flow when ARUseNewOnboarding is set to true", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ ARUseNewOnboarding: true })

    const tree = renderWithWrappers(<Onboarding />)

    expect(tree.root.findAllByType(LogIn).length).toEqual(0)
    expect(extractText(tree.root)).toContain("Onboarding")
  })
})
