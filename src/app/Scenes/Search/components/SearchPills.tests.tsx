import { fireEvent } from "@testing-library/react-native"
import { AlgoliaIndexKey, PillType } from "app/Scenes/Search/types"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { SearchPills, SearchPillsProps } from "./SearchPills"

const pills: PillType[] = [
  {
    indexName: "Artist",
    displayName: "Artist",
    type: "algolia",
    disabled: false,
    key: AlgoliaIndexKey.Artist,
  },
  {
    indexName: "ArtistSeries",
    displayName: "Artist Series",
    type: "algolia",
    disabled: false,
    key: AlgoliaIndexKey.ArtistSeries,
  },
  {
    indexName: "third",
    displayName: "Third",
    type: "algolia",
    disabled: false,
    key: AlgoliaIndexKey.Collection,
  },
]

describe("SearchPills", () => {
  const mockRef = jest.fn()
  const TestRenderer = (props: Partial<SearchPillsProps>) => {
    return (
      <SearchPills
        ref={mockRef}
        loading={false}
        pills={pills}
        onPillPress={jest.fn}
        isSelected={() => false}
        {...props}
      />
    )
  }

  it("renders without throwing an error", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    expect(getByText("Artist")).toBeTruthy()
    expect(getByText("Artist Series")).toBeTruthy()
    expect(getByText("Collection")).toBeTruthy()
  })

  it('should call "onPillPress" handler when the pill is pressed', () => {
    const onPillPressMock = jest.fn()
    const { getByText } = renderWithWrappers(<TestRenderer onPillPress={onPillPressMock} />)

    fireEvent.press(getByText("Artist Series"))

    expect(onPillPressMock).toBeCalledWith({
      type: "algolia",
      indexName: "ArtistSeries",
      displayName: "Artist Series",
      key: "ArtistSeries",
      disabled: false,
    })
  })

  it("the selected pill must be displayed correctly", () => {
    const isSelected = (pill: PillType) => pill.key === AlgoliaIndexKey.ArtistSeries
    const { getByA11yState } = renderWithWrappers(<TestRenderer isSelected={isSelected} />)

    expect(getByA11yState({ selected: true })).toHaveTextContent("Second")
  })
})
