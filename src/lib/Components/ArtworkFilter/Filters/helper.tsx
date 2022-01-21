export const goBackMock = jest.fn()

export const getEssentialProps = (params: Record<string, unknown> = {}) =>
  ({
    navigation: {
      goBack: goBackMock,
    },
    route: {
      params: {
        ...params,
      },
    },
    // navigation
  } as any)
