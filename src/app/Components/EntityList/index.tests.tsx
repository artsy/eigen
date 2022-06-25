import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { EntityList } from "./index"

describe("EntityList", () => {
  it("correctly renders one item", () => {
    const { queryByText } = renderWithWrappersTL(
      <EntityList
        prefix="Works by"
        list={[
          {
            internalID: "12345",
            slug: "foxy-production",
            name: "Foxy Production",
            href: "/foxy-production",
          },
        ]}
        count={1}
        displayedItems={2}
      />
    )

    expect(queryByText("Works by")).toBeTruthy()
    expect(queryByText("Foxy Production")).toBeTruthy()
  })

  it("correctly renders multiple items", () => {
    const { queryByText } = renderWithWrappersTL(
      <EntityList
        prefix="Works by"
        list={[
          {
            internalID: "12345",
            slug: "derya-akay",
            name: "Zarouhie Abdalian",
            href: "/artist/zarouhie-abdalian",
          },
          {
            internalID: "12345",
            slug: "derya-akay",
            name: "Derya Akay",
            href: "/artist/derya-akay",
          },
        ]}
        count={20}
        displayedItems={2}
      />
    )

    const textArr = ["Works by", "Zarouhie Abdalian,", "Derya Akay", "and", "18 others"]
    textArr.forEach((text) => {
      expect(queryByText(text)).toBeTruthy()
    })
  })
})
