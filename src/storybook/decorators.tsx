import { DecoratorFunction } from "@storybook/addons"
import { ThemeV2, ThemeV3 } from "palette"
import React from "react"

export const withThemeV2: DecoratorFunction<React.ReactNode> = (story) => <ThemeV2>{story()}</ThemeV2>

export const withThemeV3: DecoratorFunction<React.ReactNode> = (story) => <ThemeV3>{story()}</ThemeV3>
