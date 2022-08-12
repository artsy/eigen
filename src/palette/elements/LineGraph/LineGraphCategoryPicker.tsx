import { useColor } from "palette"
import { Spacer } from "palette/atoms"
import { useEffect, useRef, useState } from "react"
import { Dimensions, LayoutRectangle, ViewProps } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { Flex } from "../Flex"
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

  const getIndexForSelectedCategory = (): number => {
    let index = 0
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].name === selectedCategory) {
        index = i
        break
      }
    }
    return index
  }
  const initialSelectedIndex = getIndexForSelectedCategory()

  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex)

  const allLayoutsPresent = categoryLayouts.every((l) => l)
  const scrollViewRef = useRef<ScrollView>(null)
  const { width: screenWidth } = Dimensions.get("window")

  useEffect(() => {
    if (allLayoutsPresent) {
      let left = 20
      for (let i = 0; i < selectedIndex; i++) {
        left += categoryLayouts[i]!.width
      }
      const center = left + categoryLayouts[selectedIndex]!.width / 2
      const scrollLeft = center - screenWidth / 2
      scrollViewRef.current?.scrollTo({ x: scrollLeft })
    }
  }, [selectedIndex, selectedCategory])

  const onSelectCategory = (category: string, index: number) => {
    setSelectedIndex(index)
    onCategorySelected(category)
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      testID="line-graph-category-picker"
    >
      {categories.map((category, index) => (
        <Flex key={index + category.name} flexDirection="row">
          <CategoryPill
            onCategorySelected={(sCategory) => onSelectCategory(sCategory, index)}
            selectedCategory={selectedCategory}
            dotColor={category.color}
            category={category.name}
            onLayout={(e) => {
              const layout = e.nativeEvent.layout
              setCategoryLayouts((layouts) => {
                const result = layouts.slice(0)
                result[index] = layout
                return result
              })
            }}
          />
          <Spacer p={0.5} />
        </Flex>
      ))}
    </ScrollView>
  )
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
      testID="categoryPill"
    >
      <Text variant="xs" color={itemColor}>
        {category}
      </Text>
    </Pill>
  )
}
