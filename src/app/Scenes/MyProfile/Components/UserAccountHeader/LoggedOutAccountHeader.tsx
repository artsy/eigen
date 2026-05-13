import { PersonIcon } from "@artsy/icons/native"
import { Button, Flex, Join, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { useAuthBottomSheet } from "app/Components/AuthBottomSheet/AuthBottomSheetProvider"

const PROFILE_IMAGE_SIZE = 70

interface LoggedOutAccountHeaderProps {
  showBorder?: boolean
}

export const LoggedOutAccountHeader: React.FC<LoggedOutAccountHeaderProps> = ({ showBorder }) => {
  const color = useColor()
  const { present } = useAuthBottomSheet()

  const Wrapper = showBorder
    ? ({ children }: React.PropsWithChildren) => (
        <Flex
          minHeight={200}
          borderRadius={20}
          borderColor="mono10"
          borderWidth={1}
          alignItems="center"
          justifyContent="center"
          p={2}
          mx={2}
          mt={2}
        >
          {children}
        </Flex>
      )
    : ({ children }: React.PropsWithChildren) => (
        <Flex borderRadius={20} alignItems="center" px={2} pb={1} mb={2}>
          {children}
        </Flex>
      )

  return (
    <Wrapper>
      <Join separator={<Spacer y={2} />}>
        <Flex
          height={PROFILE_IMAGE_SIZE}
          width={PROFILE_IMAGE_SIZE}
          borderRadius={PROFILE_IMAGE_SIZE / 2}
          backgroundColor={color("mono5")}
          borderWidth={1}
          borderColor={color("mono10")}
          alignItems="center"
          justifyContent="center"
        >
          <PersonIcon width={18} height={18} />
        </Flex>

        <Flex alignItems="center" px={2}>
          <Text variant="md" textAlign="center">
            Sign up or log in
          </Text>
          <Text variant="sm" color="mono60" textAlign="center" mt={0.5}>
            Save artworks, follow artists, and access your collection across devices.
          </Text>
        </Flex>

        <Button block onPress={() => present({ intent: "generic" })}>
          Sign up or log in
        </Button>
      </Join>
    </Wrapper>
  )
}
