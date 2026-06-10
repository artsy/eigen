import { Flex, Spinner, Text } from "@artsy/palette-mobile"
import { WelcomeStepQuery } from "__generated__/WelcomeStepQuery.graphql"
import { Suspense, useEffect } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { Logo } from "./Logo"

const WELCOME_DISPLAY_DURATION = 3000

interface WelcomeStepProps {
  onNext: () => void
}

const WelcomeStepContent: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const { me } = useLazyLoadQuery<WelcomeStepQuery>(
    WelcomeStepScreenQuery,
    {},
    { fetchPolicy: "network-only" }
  )

  useEffect(() => {
    const timer = setTimeout(onNext, WELCOME_DISPLAY_DURATION)
    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <Flex flex={1} justifyContent="center" px={2} backgroundColor="mono100">
      <Logo />
      <Text variant="xl" color="mono0">
        Welcome{"\n"}to Artsy,{"\n"}
        {me?.name}
      </Text>
    </Flex>
  )
}

const Placeholder: React.FC = () => (
  <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="mono100">
    <Logo />
    <Spinner color="mono0" />
  </Flex>
)

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => (
  <Suspense fallback={<Placeholder />}>
    <WelcomeStepContent onNext={onNext} />
  </Suspense>
)

const WelcomeStepScreenQuery = graphql`
  query WelcomeStepQuery {
    me {
      name
    }
  }
`
