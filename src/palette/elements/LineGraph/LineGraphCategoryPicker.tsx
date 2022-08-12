import { useColor } from "palette"
import { Spacer } from "palette/atoms"
import { useEffect, useRef, useState } from "react"
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

  let initialIndex = 0
  categories.forEach((c, index) => {
    if (c.name === selectedCategory) {
      initialIndex = index
    }
  })
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)

  const allLayoutsPresent = categoryLayouts.every((l) => l)
  const flatlistRef = useRef<FlatList<typeof categories[0]> | null>(null)

  useEffect(() => {
    if (!categories.length) {
      return
    }
    if (categories[0].name === selectedCategory) {
      // force flatlist to focus on the first item when new set of categories are loaded
      flatlistRef.current?.scrollToOffset({ offset: 0 })
      return
    }
    if (allLayoutsPresent) {
      let viewOffset = 0
      if (selectedIndex > 0) {
        // allow the preceding Pill be slightly visible
        viewOffset = categoryLayouts[selectedIndex - 1]!.width / 2
      }
      try {
        flatlistRef.current?.scrollToIndex({ index: selectedIndex, viewOffset })
      } catch (e) {
        // TODO: Support scrollToIndex for dynamically changing data.
        flatlistRef.current?.scrollToIndex({ index: 0 })
      }
    }
  }, [selectedIndex, selectedCategory, JSON.stringify(categories)])

  const onSelectCategory = (category: string, index: number) => {
    setSelectedIndex(index)
    onCategorySelected(category)
  }

  return (
    <FlatList
      ref={flatlistRef}
      initialScrollIndex={categories.length ? selectedIndex : undefined}
      initialNumToRender={30}
      onScrollToIndexFailed={(info) => {
        const pauseForLayout = new Promise((resolve) => setTimeout(resolve, 500))
        pauseForLayout.then(() => {
          flatlistRef.current?.scrollToIndex({ index: info.index })
        })
      }}
      data={categories}
      extraData={categories}
      renderItem={({ item: category, index }) => (
        <CategoryPill
          onCategorySelected={(sCategory) => onSelectCategory(sCategory, index)}
          selectedCategory={selectedCategory}
          dotColor={category.color}
          category={category.name}
          key={index + category.name}
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
