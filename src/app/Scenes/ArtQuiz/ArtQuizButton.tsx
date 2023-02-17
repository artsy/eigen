import { CloseIcon, HeartIcon, Touchable } from "@artsy/palette-mobile"

interface ArtQuizButtonProps {
  variant: "Like" | "Dislike"
  onPress: () => void
}

export const ArtQuizButton = ({ variant, onPress }: ArtQuizButtonProps) => {
  return (
    <Touchable onPress={onPress}>
      {variant === "Like" ? (
        <HeartIcon height={40} width={50} />
      ) : (
        <CloseIcon height={40} width={50} />
      )}
    </Touchable>
  )
}
