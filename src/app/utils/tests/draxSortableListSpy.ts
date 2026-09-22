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

export const mockDrax = () => {
  const actual = jest.requireActual("react-native-drax")

  return {
    ...actual,
    useSortableList: (options: UseSortableListOptions<string>): SortableListHandle<string> => {
      mounted.push(options)
      return actual.useSortableList(options)
    },
  }
}

/**
 * Drops the stop at `fromIndex` onto `toIndex` in the nth sortable list to have mounted —
 * one per rendered section, in the order the sections render.
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
}
