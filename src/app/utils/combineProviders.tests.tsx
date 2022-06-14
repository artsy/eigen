import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { View } from "react-native"
import { combineProviders } from "./combineProviders"

const Child = () => <View testID="child" />
const ProviderA = (props: any) => <View testID="A" {...props} />
const ProviderB = (props: any) => <View testID="B" {...props} />
const ProviderCSpecial = (props: { needed: string }) => <View testID="C" {...props} />
const ProviderC = (props: any) => <ProviderCSpecial needed="special" {...props} />

describe("combineProviders", () => {
  it("works", () => {
    const Providers = ({ children }: { children?: React.ReactNode }) =>
      combineProviders([ProviderA, ProviderB, ProviderC], children)

    const { toJSON } = renderWithWrappersTL(
      <Providers>
        <Child />
      </Providers>
    )

    expect(toJSON()).toMatchInlineSnapshot(`
      <View
        testID="A"
      >
        <View
          testID="B"
        >
          <View
            needed="special"
            testID="C"
          >
            <View
              testID="child"
            />
          </View>
        </View>
      </View>
    `)
  })
})
