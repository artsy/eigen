import { fireEvent, screen } from "@testing-library/react-native"
import { EmbeddedCarousel } from "app/Components/EmbeddedCarousel"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text, View } from "react-native"

describe("EmbeddedCarousel", () => {
  const mockData = [
    { id: "1", title: "Item 1" },
    { id: "2", title: "Item 2" },
    { id: "3", title: "Item 3" },
  ]

  const mockRenderItem = ({ item }: { item: (typeof mockData)[0] }) => (
    <View testID={`item-${item.id}`}>
      <Text>{item.title}</Text>
    </View>
  )

  it("renders with title and items", () => {
    renderWithWrappers(
      <EmbeddedCarousel
        testID="test-carousel"
        title="Test Carousel"
        data={mockData}
        renderItem={mockRenderItem}
      />
    )

    expect(screen.getByText("Test Carousel")).toBeTruthy()
    expect(screen.getByText("Item 1")).toBeTruthy()
    expect(screen.getByText("Item 2")).toBeTruthy()
    expect(screen.getByText("Item 3")).toBeTruthy()
  })

  it("does not render when data is empty", () => {
    renderWithWrappers(
      <EmbeddedCarousel
        testID="empty-carousel"
        title="Empty Carousel"
        data={[]}
        renderItem={mockRenderItem}
      />
    )

    // Should not render anything when data is empty
    expect(screen.queryByText("Empty Carousel")).toBeNull()
  })

  it("handles onCardPress event", () => {
    const onCardPressMock = jest.fn()

    renderWithWrappers(
      <EmbeddedCarousel
        testID="clickable-carousel"
        title="Clickable Carousel"
        data={mockData}
        renderItem={mockRenderItem}
        onCardPress={onCardPressMock}
      />
    )

    // Click on the first item
    fireEvent.press(screen.getByText("Item 1"))

    expect(onCardPressMock).toHaveBeenCalledTimes(1)
  })

  it("renders without title", () => {
    renderWithWrappers(
      <EmbeddedCarousel testID="no-title-carousel" data={mockData} renderItem={mockRenderItem} />
    )

    // Items should render but no title
    expect(screen.getByText("Item 1")).toBeTruthy()
    expect(screen.getByText("Item 2")).toBeTruthy()
    expect(screen.getByText("Item 3")).toBeTruthy()
  })
})
