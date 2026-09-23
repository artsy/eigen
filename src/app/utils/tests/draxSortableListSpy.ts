import { createElement } from "react"
import type {
  SortableListHandle,
  SortableReorderEvent,
  UseSortableListOptions,
} from "react-native-drax"

/**
 * A drag can't be fired through the jest mock — drax's gesture handling and its measurements
 * are both native. `onReorder` is a plain callback though, so this leaves the real library in
 * place and only records the options each sortable list was mounted with, letting a test fire
 * a drop straight at the callback.
 *
 *   jest.mock("react-native-drax", () => require("app/utils/tests/draxSortableListSpy").mockDrax())
 */
const mounted: UseSortableListOptions<string>[] = []

/**
 * Whether each mounted `SortableItem` was given `draggable`. `draggable` only gates the real
 * gesture, which nothing here can fire — this is how a test instead confirms a screen passed
 * `canReorder={false}` all the way down to the item drax actually drags.
 */
let itemDraggableFlags: boolean[] = []

/**
 * Two options are "the same list" if they hold the same set of stop ids, regardless of order —
 * a section's own re-render reorders or reshuffles its `data`, it doesn't change which stops
 * belong to it. Used to overwrite a section's entry in place on re-render instead of appending a
 * new one, so `mounted`'s slots stay keyed by section rather than by render count.
 */
const sameList = (a: UseSortableListOptions<string>, b: UseSortableListOptions<string>) => {
  const aIds = new Set(a.data)
  return b.data.length === aIds.size && b.data.every((id) => aIds.has(id))
}

export const mockDrax = () => {
  const actual = jest.requireActual("react-native-drax")

  return {
    ...actual,
    useSortableList: (options: UseSortableListOptions<string>): SortableListHandle<string> => {
      const existingIndex = mounted.findIndex((entry) => sameList(entry, options))

      if (existingIndex === -1) {
        mounted.push(options)
      } else {
        mounted[existingIndex] = options
      }

      return actual.useSortableList(options)
    },
    SortableItem: (props: { draggable?: boolean }) => {
      itemDraggableFlags.push(!!props.draggable)

      return createElement(actual.SortableItem, props)
    },
  }
}

/** `draggable` as given to every `SortableItem` mounted since the last reset, in mount order. */
export const sortableItemDraggableFlags = () => itemDraggableFlags

/**
 * Drops the stop at `fromIndex` onto `toIndex` in the nth sortable list to have mounted —
 * one per rendered section, in the order the sections first render. A section re-rendering
 * (its own state changing) overwrites its existing slot rather than shifting the others.
 */
export const dropSortableItem = (sortableIndex: number, fromIndex: number, toIndex: number) => {
  const options = mounted[sortableIndex]

  if (!options) {
    throw new Error(`No sortable list mounted at index ${sortableIndex}`)
  }

  const data = options.data
  const event: SortableReorderEvent<string> = {
    data,
    fromIndex,
    toIndex,
    fromItem: data[fromIndex],
    toItem: data[toIndex],
    isExternalDrag: false,
  }

  options.onReorder(event)
}

export const resetSortableListSpy = () => {
  mounted.length = 0
  itemDraggableFlags = []
}
