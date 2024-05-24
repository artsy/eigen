import { Flex, Spinner } from "@artsy/palette-mobile"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { Suspense } from "react"

export const withSuspense =
  (
    Component: React.FC<any>,
    Fallback: React.FC<any> = () => (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    )
  ) =>
  (props: any) => {
    return (
      <Suspense
        fallback={
          <ProvidePlaceholderContext>
            <Fallback {...props} />
          </ProvidePlaceholderContext>
        }
      >
        <Component {...props} />
      </Suspense>
    )
  }
