import { useColor } from "palette"
import { Spacer } from "palette/atoms"
import { FlatList } from "react-native-gesture-handler"
import { Pill } from "../Pill"
import { Text } from "../Text"
import { ColoredDot, DEFAULT_DOT_COLOR } from "./ColoredDot"

interface LineGraphCategoryPickerProps {
  categories: Array<{ name: string; color: string }>
  onCategorySelected: CategoryPillProps["onCategorySelected"]
  selectedCategory: string
}
export const LineGraphCategoryPicker: React.FC<LineGraphCategoryPickerProps> = ({
  categories,
  onCategorySelected,
  selectedCategory,
}) => {
  return (
    <FlatList
      data={categories}
      renderItem={({ item: category, index }) => (
        <CategoryPill
          onCategorySelected={onCategorySelected}
          selectedCategory={selectedCategory}
          dotColor={category.color}
          category={category.name}
          key={index}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      testID="line-graph-category-picker"
      ItemSeparatorComponent={() => <Spacer p={0.5} />}
    />
  )
}

interface CategoryPillProps {
  category: string
  dotColor?: string
  onCategorySelected: (category: string) => void
  selectedCategory: string
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  dotColor,
  onCategorySelected,
  selectedCategory,
}) => {
  const color = useColor()

  const isEnabled = selectedCategory === category

  const itemColor = isEnabled ? color("black100") : color("black60")

  const handlePress = () => {
    onCategorySelected(category)
  }

  return (
    <Pill
      highlightEnabled
      borderColor={itemColor}
      Icon={() => <ColoredDot disabled={!isEnabled} color={dotColor ?? DEFAULT_DOT_COLOR} />}
      rounded
      onPress={handlePress}
    >
      <Text variant="xs" color={itemColor}>
        {category}
      </Text>
    </Pill>
  )
}
