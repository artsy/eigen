import { screen, within } from "@testing-library/react-native"
import { combineProviders } from "app/utils/combineProviders"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { View } from "react-native"

const Child = () => <View testID="child" />
const ProviderA = (props: any) => <View testID="A" {...props} />
const ProviderB = (props: any) => <View testID="B" {...props} />
const ProviderCSpecial = (props: { needed: string }) => <View testID="C" {...props} />
const ProviderC = (props: any) => <ProviderCSpecial needed="special" {...props} />

describe("combineProviders", () => {
  it("works", async () => {
    const Providers = ({ children }: { children?: React.ReactNode }) =>
      combineProviders([ProviderA, ProviderB, ProviderC], children)

    await renderWithWrappers(
      <Providers>
        <Child />
      </Providers>
    )

    // providers are nested in order A > B > C > child
    const providerA = screen.getByTestId("A")
    const providerB = within(providerA).getByTestId("B")
    const providerC = within(providerB).getByTestId("C")

    expect(providerC).toHaveProp("needed", "special")
    expect(within(providerC).getByTestId("child")).toBeOnTheScreen()

    // each provider is rendered exactly once
    expect(screen.getAllByTestId("A")).toHaveLength(1)
    expect(screen.getAllByTestId("B")).toHaveLength(1)
    expect(screen.getAllByTestId("C")).toHaveLength(1)
    expect(screen.getAllByTestId("child")).toHaveLength(1)
  })
})
