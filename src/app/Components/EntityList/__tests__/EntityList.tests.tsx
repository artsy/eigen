import { EntityList } from "app/Components/EntityList/EntityList"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("EntityList", () => {
  it("correctly renders one item", () => {
    const { queryByText } = renderWithWrappers(
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
        onItemSelected={jest.fn()}
      />
    )

    expect(queryByText("Works by")).toBeTruthy()
    expect(queryByText("Foxy Production")).toBeTruthy()
  })

  it("correctly renders multiple items", () => {
    const { queryByText } = renderWithWrappers(
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
        onItemSelected={jest.fn()}
      />
    )

    const textArr = ["Works by", "Zarouhie Abdalian,", "Derya Akay", "and", "18 others"]
    textArr.forEach((text) => {
      expect(queryByText(text)).toBeTruthy()
    })
  })
})
