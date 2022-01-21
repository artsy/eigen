import React from "react"

// v3
import { Select as SelectV3, SelectOption, SelectProps as SelectV3Props } from "./Select"
export { SelectV3, SelectV3Props, SelectOption }

// v2
import { Select as SelectV2, SelectProps as SelectV2Props } from "./SelectV2"
export { SelectV2, SelectV2Props }

export type SelectProps<ValueType> = (SelectV2Props<ValueType> | SelectV3Props<ValueType>) & {
  ref?: React.MutableRefObject<any>
}

export type SelectComponentI<ValueType = any> = React.FC<SelectProps<ValueType>>
// export type SelectComponentI = React.FC<React.ComponentPropsWithRef<typeof SelectV2>>

export const Select = <ValueType,>(props: SelectProps<ValueType>) => (
  <SelectV3 {...transformV3Props(props)} />
)

const transformV3Props = <T,>(props: SelectV2Props<T>): SelectV3Props<T> => {
  return { ...props } as SelectV3Props<T>
}
