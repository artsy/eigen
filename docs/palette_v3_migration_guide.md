# Palette v3 migration guide

- Use `ThemeV2` and `ThemeV3`.
  Currently `Theme` is pointing to `ThemeV2`, and later it will point to `ThemeV3`. During the v2 -> v3 migration, the more explicit we are, the better.

- Use `useTheme` to get access to `color` and `space`.
  We used to use `color` and `space` imported from `palette` directly. Unforunately, this is not theme-aware, so we need to change our ways. Always use `const { color, space } = useTheme()` or `const color = useColor()` or `const space = useSpace()`, to get the theme-aware functionality we need.

- Use `themeGet` for styled-components, but try to avoid styled-components.
  If you need to access anything from the theme within a styled-component, you should use `themeGet` like:

```tsx
import { themeGet } from "@styled-system/theme-get"

const TheComp = styled(Flex)`
  background-color: ${themeGet("colors.black100")};
  margin-left: ${themeGet("space.2")}px;
  border-width: 3;
`
```

One limitation here is that you cannot use `0.5` or any other value of `space` that has a dot in the name. Prefer to use simple components instead, like:

```tsx
const TheComp = (props) => {
  const { color, space } = useTheme()
  return (
    <Flex
      {...props}
      style={[
        props.style,
        {
          backgroundColor: color("black100"),
          marginLeft: space("0.5"),
          borderWidth: 3,
        },
      ]}
    />
  )
}
```

- Use `ClassTheme` for class components.
  `ClassTheme` exposes the hooks of the theme, so you can use it like:

```tsx
import { ClassTheme } from "palette"

class TheComp extends React.Component {
  render() {
    return (
      <ClassTheme theme="v2">
      {({color, space, theme}) => (
        <View style={{ backgroundColor: color("white100") }}>
      )}
      </ClassTheme>
    )
  }
}
```
