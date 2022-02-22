import { Flex, Sans, useColor } from "palette"
import React from "react"
import { Switch } from "react-native"

interface SwitchMenuProps {
  onChange: (value: boolean) => void
  value: boolean
  title: string
  description: string
  disabled?: boolean
}

export const SwitchMenu = ({
  onChange,
  value,
  title,
  description,
  disabled = false,
}: SwitchMenuProps) => {
  const color = useColor()
  return (
    <Flex flexDirection="row" alignItems="flex-start" flexShrink={0} my={1}>
      <Flex style={{ width: "80%", justifyContent: "center" }}>
        <Sans size="4t" color={disabled ? "black60" : "black100"}>
          {title}
        </Sans>
        <Sans size="3t" color={disabled ? "black30" : "black60"} py={0.5}>
          {description}
        </Sans>
      </Flex>
      <Flex style={{ width: "20%" }} alignItems="flex-end">
        <Switch
          trackColor={{
            false: color("black10"),
            true: disabled ? color("black30") : color("black100"),
          }}
          onValueChange={onChange}
          value={value}
          disabled={disabled}
        />
      </Flex>
    </Flex>
  )
}
