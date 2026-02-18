type AllowedProvider =
  | React.FC<React.PropsWithChildren>
  | React.FC
  | React.ComponentClass<{ children: React.ReactNode }>
  | React.ComponentType
  | React.ForwardRefExoticComponent<any>
type FilteredOutProvider = false | undefined

type ProviderList = Array<AllowedProvider | FilteredOutProvider>

/**
 * This function can takes a list of Providers and returns
 * one Provider that contains all of them.
 * It's used to provide a cleaner way to combine multiple Providers.
 *
 * Usage:
 * const Providers = ({children}) => combineProviders(
 *   [
 *     ProviderA,
 *     ProviderB,
 *     ProviderC,
 *   ],
 *   children
 * )
 *
 * This will be the same as writing the following:
 * const Providers = ({children}) => (
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
  (
    list
      // filter out falsy items
      .filter(Boolean) as Array<AllowedProvider>
  ).reduceRight((acc, Provider) => <Provider>{acc}</Provider>, <>{children}</>)
