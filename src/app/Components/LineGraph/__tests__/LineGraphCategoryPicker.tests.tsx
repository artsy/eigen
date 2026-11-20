import { fireEvent, screen } from "@testing-library/react-native"
import {
  CategoryPill,
  LineGraphCategoryPicker,
} from "app/Components/LineGraph/LineGraphCategoryPicker"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("LineGraphCategoryPicker", () => {
  const categories = [
    { name: "Cat1", color: "#000" },
    { name: "Cat2", color: "#000" },
  ]
  it("renders without errors", async () => {
    await renderWithWrappers(
      <LineGraphCategoryPicker
        categories={categories}
        selectedCategory="Cat1"
        onCategorySelected={jest.fn()}
      />
    )
    expect(await screen.findByTestId("line-graph-category-picker")).toBeTruthy()
  })

  it("onCategorySelected callback is fired onPress", async () => {
    const onCategorySelected = jest.fn()
    await renderWithWrappers(
      <CategoryPill
        category="Cat1"
        onLayout={jest.fn()}
        selectedCategory="Cat1"
        onCategorySelected={onCategorySelected}
      />
    )
    const categoryPill = await screen.findByTestId("categoryPill")

    await fireEvent(categoryPill, "onPress")
    expect(onCategorySelected).toHaveBeenCalledWith(categories[0].name)
  })
})
