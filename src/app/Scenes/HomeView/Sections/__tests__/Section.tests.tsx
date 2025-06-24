import { screen } from "@testing-library/react-native"
import { Section, SectionProps } from "app/Scenes/HomeView/Sections/Section"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Section", () => {
  describe("when in __DEV__ mode", () => {
    beforeAll(() => {
      // @ts-ignore
      global.__DEV__ = true
    })

    afterAll(() => {
      // @ts-ignore
      global.__DEV__ = false
    })

    it("raises an error if section ID is missing", () => {
      const section = {
        internalID: null,
      }
      expect(() => {
        renderWithWrappers(
          // @ts-expect-error internalID=null intentionally
          <Section section={section} index={1} />
        )
      }).toThrow()
    })

    it("renders a message if section type is not recognized", () => {
      const section = {
        __typename: "SomeUnknownSectionType",
        internalID: "42",
      } as SectionProps["section"]
      renderWithWrappers(<Section section={section} index={1} />)
      expect(screen.getByText(/Non supported section/)).toBeOnTheScreen()
    })
  })

  describe("when not in __DEV__ mode", () => {
    beforeAll(() => {
      // @ts-ignore
      global.__DEV__ = false
    })

    afterAll(() => {
      // @ts-ignore
      global.__DEV__ = false
    })

    it("does not raise an error if section ID is missing", () => {
      const section = {
        internalID: null,
      }
      expect(() => {
        renderWithWrappers(
          // @ts-expect-error internalID=null intentionally
          <Section section={section} index={1} />
        )
      }).not.toThrow()
    })

    it("does not render a message if section type is not recognized", () => {
      const section = {
        __typename: "SomeUnknownSectionType",
        internalID: "42",
      } as SectionProps["section"]
      renderWithWrappers(<Section section={section} index={1} />)
      expect(screen.queryByText(/Non supported section/)).not.toBeOnTheScreen()
    })
  })

  describe("with an optional component.type", () => {
    it("renders FeaturedCollection", () => {
      const section = {
        __typename: "SomeSectionType",
        internalID: "42",
        component: {
          type: "FeaturedCollection",
        },
      } as SectionProps["section"]
      renderWithWrappers(<Section section={section} index={1} />)
      expect(screen.getByTestId("HomeViewSectionFeaturedCollectionPlaceholder")).toBeOnTheScreen()
    })

    it("renders FeaturedCollection", () => {
      const section = {
        __typename: "SomeSectionType",
        internalID: "42",
        component: {
          type: "ArticlesCard",
        },
      } as SectionProps["section"]
      renderWithWrappers(<Section section={section} index={1} />)
      expect(screen.getByTestId("HomeViewSectionArticlesCardsPlaceholder")).toBeOnTheScreen()
    })
  })
})
