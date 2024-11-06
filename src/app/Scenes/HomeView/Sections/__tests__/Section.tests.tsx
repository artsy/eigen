import { screen, render } from "@testing-library/react-native"
import { Section, SectionProps } from "app/Scenes/HomeView/Sections/Section"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: jest.fn(),
}))

const mockUseFeatureFlag = useFeatureFlag as jest.Mock
mockUseFeatureFlag.mockImplementation(() => true)

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
        render(
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
        render(
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

    it("renders Chips", () => {
      const section = {
        __typename: "SomeSectionType",
        internalID: "42",
        component: {
          type: "Chips",
        },
      } as SectionProps["section"]
      renderWithWrappers(<Section section={section} index={1} />)
      expect(screen.getByTestId("HomeViewSectionCardsChipsPlaceholder")).toBeOnTheScreen()
    })
  })
})
