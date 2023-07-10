import { Flex } from "@artsy/palette-mobile"
import { Fragment, ReactElement } from "react"

interface MasonryStaticProps<T> {
  data: T[]
  renderItem: (props: { item: T; index: number }) => ReactElement
  columnKey: string
  numColumns?: number
  columnSeparator?: () => ReactElement
}

/**
 * Mansory static list, ideal for not soo long lists using the masonry layout
 * do not use this component for infinite loading lists or a too large dataset
 */
export function MasonryStatic<T>({
  data,
  renderItem,
  numColumns = 2,
  columnSeparator,
  columnKey,
}: MasonryStaticProps<T>) {
  const itemsColumns: T[][] = Array.from({ length: numColumns }, () => [])

  data.forEach((item, index) => itemsColumns[index % numColumns].push(item))

  if (data.length === 0) {
    return null
  }

  return (
    <Flex flex={1} flexDirection="row">
      {itemsColumns.map((items, i) => (
        <Fragment key={`masonry-column-${i}-${columnKey}`}>
          <Flex flex={1}>
            {items.map((item, index) => (
              <Fragment key={`masonry-item-${index}-${columnKey}`}>
                {renderItem({ item, index })}
              </Fragment>
            ))}
          </Flex>

          {!!columnSeparator && (i + 1) % numColumns !== 0 && columnSeparator()}
        </Fragment>
      ))}
    </Flex>
  )
}
