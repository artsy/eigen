import { useColor, useSpace } from "palette"
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

  const alignSelectedToCenter = () => {
    if (allLayoutsPresent) {
      if (categories?.[selectedIndex]?.name !== selectedCategory) {
        setSelectedIndex(0)
        return
      }
      let left = 20
      for (let i = 0; i < selectedIndex; i++) {
        left += categoryLayouts[i]!.width
      }
      const center = left + categoryLayouts[selectedIndex]!.width / 2
      const scrollLeft = center - screenWidth / 2
      scrollViewRef.current?.scrollTo({ x: scrollLeft })
    }
  }
  useEffect(() => {
    alignSelectedToCenter()
  })

  const onSelectCategory = (category: string, index: number) => {
    setSelectedIndex(index)
    onCategorySelected(category)
  }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingEnd: screenWidth / 2,
      }}
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      testID="line-graph-category-picker"
    >
      {categories.map((category, index) => (
        <Flex key={index + category.name} flexDirection="row">
          <Spacer p={index === 0 ? 1 : 0.5} />
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
  const space = useSpace()

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
      hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
    >
      <Text variant="xs" color={itemColor}>
        {category}
      </Text>
    </Pill>
  )
}
