import { useColor } from "palette"
import { Spacer } from "palette/atoms"
import { useEffect, useMemo, useRef, useState } from "react"
import { LayoutRectangle, ViewProps } from "react-native"
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
  const [categoryLayouts, setCategoryLayouts] = useState<Array<LayoutRectangle | null>>(
    categories.map(() => null)
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  const allLayoutsPresent = categoryLayouts.every((l) => l)
  const flatlistRef = useRef<FlatList<typeof categories[0]> | null>(null)

  useEffect(() => {
    if (allLayoutsPresent) {
      let viewOffset = 0
      if (selectedIndex > 0) {
        // allow the preceding Pill be slightly visible
        viewOffset = categoryLayouts[selectedIndex - 1]!.width / 2
      }
      flatlistRef.current?.scrollToIndex({ index: selectedIndex, viewOffset })
    }
  }, [selectedIndex, selectedCategory])

  const onSelectCategory = (category: string, index: number) => {
    setSelectedIndex(index)
    onCategorySelected(category)
  }

  return useMemo(() => {
    return (
      <FlatList
        ref={flatlistRef}
        data={categories}
        renderItem={({ item: category, index }) => (
          <CategoryPill
            onCategorySelected={(sCategory) => onSelectCategory(sCategory, index)}
            selectedCategory={selectedCategory}
            dotColor={category.color}
            category={category.name}
            key={index}
            onLayout={(e) => {
              const layout = e.nativeEvent.layout
              setCategoryLayouts((layouts) => {
                const result = layouts.slice(0)
                result[index] = layout
                return result
              })
            }}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        testID="line-graph-category-picker"
        ItemSeparatorComponent={() => <Spacer p={0.5} />}
      />
    )
  }, [selectedCategory])
}

interface CategoryPillProps {
  category: string
  dotColor?: string
  onCategorySelected: (category: string) => void
  onLayout: ViewProps["onLayout"]
  selectedCategory: string
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  dotColor,
  onCategorySelected,
  onLayout,
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
      onLayout={onLayout}
    >
      <Text variant="xs" color={itemColor}>
        {category}
      </Text>
    </Pill>
  )
}
