import { useColor, Text } from "@artsy/palette-mobile"

export const InputTitle: React.FC<
  React.PropsWithChildren<{ optional?: boolean; required?: boolean }>
> = ({ children: title, optional, required }) => {
  const color = useColor()

  if (!title) {
    return null
  }

  return (
    <Text
      variant="sm-display"
      style={{ fontSize: 13, marginBottom: 2, textTransform: "uppercase" }}
    >
      {title}
      {!!required && (
        <Text
          variant="sm-display"
          style={{ fontSize: 13, textTransform: "none" }}
          color={color("mono60")}
        >
          {" "}
          Required
        </Text>
      )}
      {!!optional && (
        <Text
          variant="sm-display"
          style={{ fontSize: 13, textTransform: "none" }}
          color={color("mono60")}
        >
          {" "}
          Optional
        </Text>
      )}
    </Text>
  )
}
