import { Text } from "palette"

interface ArtworkLotDetailsRowProps {
  title: string
  value: string
}

export const ArtworkLotDetailsRow: React.FC<ArtworkLotDetailsRowProps> = ({ title, value }) => {
  return (
    <>
      <Text variant="sm">{title}</Text>
      <Text variant="sm-display" fontWeight="bold">
        {value}
      </Text>
    </>
  )
}
