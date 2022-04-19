type ProviderList = Array<React.FC | React.ComponentClass<{ children: React.ReactNode }>>

/**
 * This function can takes a list of Providers and returns
 * one Provider that contains all of them.
 * It's used to provide a cleaner way to combine multiple Providers.
 *
 * Usage:
 * const AppProviders = ({children}) => combineProviders(
 *   [
 *     ProviderA,
 *     ProviderB,
 *     ProviderC,
 *   ],
 *   children
 * )
 *
 * This will be the same as writing the following:
 * const AppProviders = ({children}) => (
 *   <ProviderA>
 *     <ProviderB>
 *       <ProviderC>
 *         {children}
 *       </ProviderC>
 *     </ProviderB>
 *   </ProviderA>
 * )
 *
 * @param list A list of Providers.
 * @param children The children that will be wrapped.
 * @returns A Provider that includes all the Providers from `list`.
 */
export const combineProviders = (list: ProviderList, children: React.ReactNode) =>
  list.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, <>{children}</>)
