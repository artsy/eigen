import { fireEvent } from "@testing-library/react-native"
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
    const { findByTestId } = renderWithWrappers(
      <LineGraphCategoryPicker
        categories={categories}
        selectedCategory="Cat1"
        onCategorySelected={jest.fn()}
      />
    )
    expect(await findByTestId("line-graph-category-picker")).toBeTruthy()
  })

  it("onCategorySelected callback is fired onPress", async () => {
    const onCategorySelected = jest.fn()
    const { findByTestId } = renderWithWrappers(
      <CategoryPill
        category="Cat1"
        onLayout={jest.fn()}
        selectedCategory="Cat1"
        onCategorySelected={onCategorySelected}
      />
    )
    const categoryPill = await findByTestId("categoryPill")

    fireEvent(categoryPill, "onPress")
    expect(onCategorySelected).toHaveBeenCalledWith(categories[0].name)
  })
})
