import React, { ComponentClass, FC, ReactNode } from "react"

type ProviderList = Array<FC | ComponentClass<{ children: ReactNode }>>

export const combineProviders = (list: ProviderList, children: ReactNode) =>
  list.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, <>{children}</>)
