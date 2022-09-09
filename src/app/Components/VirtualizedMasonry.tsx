import { Flex } from "palette"
import { useMemo } from "react"
import { Dimensions, FlatList, FlatListProps } from "react-native"

type MasonryProps<ItemT> = {
  width?: number
  gutter?: number
  getBrickHeight(item: ItemT, brickWidth?: number): number
} & FlatListProps<ItemT>

interface Brick<ItemT> {
  item: ItemT
  height: number
}

interface Row<ItemT> {
  brick: Brick<ItemT>
  columnIndex: number
  height: number
}

export function Masonry<ItemT>({
  numColumns = 2,
  gutter = 0,
  width = Dimensions.get("screen").width,
  data,
  renderItem,
  getBrickHeight,
  keyExtractor,
  ...otherProps
}: MasonryProps<ItemT>) {
  const columns = useMemo(() => Array.from({ length: numColumns }), [numColumns])

  const brickWidth = useMemo(
    () => (width - (numColumns - 1) * gutter) / numColumns,
    [width, numColumns, gutter]
  )

  const brickData: Array<Brick<ItemT>> = useMemo(
    () =>
      data
        ? data.map((i) => ({
            item: i,
            height: getBrickHeight(i, (width + gutter) / numColumns - gutter),
          }))
        : [],
    [data, width, gutter, numColumns]
  )

  const rowData: Array<Row<ItemT>> = useMemo(() => {
    const columnsHeight = columns.map(() => 0)

    return brickData.map((brick, index, arr) => {
      const isLast = index === arr.length - 1
      const currentMinHeight = Math.min(...columnsHeight)
      const columnIndex = columnsHeight.indexOf(currentMinHeight)

      columnsHeight[columnIndex] = columnsHeight[columnIndex] + brick.height + gutter

      const afterMinHeight = Math.min(...columnsHeight)
      const afterMaxHeight = Math.max(...columnsHeight)
      const rowHeight = (isLast ? afterMaxHeight : afterMinHeight) - currentMinHeight

      return {
        height: rowHeight,
        brick,
        columnIndex,
      }
    })
  }, [brickData, columns, gutter])

  return (
    <FlatList
      {...otherProps}
      CellRendererComponent={(props) => <Flex pointerEvents="box-none">{props.children}</Flex>}
      data={rowData}
      renderItem={({ item: row, index, separators }) => (
        <Flex
          pointerEvents="box-none"
          height={row.height}
          flexDirection="row"
          mx={gutter / -2}
          mt={index < numColumns ? gutter / -2 : 0}
          mb={index === rowData.length - 1 ? gutter / -2 : 0}
        >
          {columns.map((_val, i) => (
            <Flex key={`${index}-${i}`} pointerEvents="box-none" flex={1} p={gutter / 2}>
              {i === row.columnIndex && renderItem ? (
                <Flex width={brickWidth} height={row.brick.height}>
                  {renderItem({ item: row.brick.item, index, separators })}
                </Flex>
              ) : null}
            </Flex>
          ))}
        </Flex>
      )}
      getItemLayout={(layoutData, i) =>
        layoutData
          ? {
              length: layoutData[i].height,
              offset: layoutData.slice(0, i).reduce((sum, row) => sum + row.height, 0),
              index: i,
            }
          : { length: 0, offset: 0, index: i }
      }
      keyExtractor={keyExtractor ? (row, index) => keyExtractor(row.brick.item, index) : undefined}
      getItem={undefined}
    />
  )
}
