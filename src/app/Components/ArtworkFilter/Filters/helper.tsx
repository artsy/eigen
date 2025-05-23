export const goBackMock = jest.fn()

export const getEssentialProps = (params: {} = {}) =>
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
  }) as any
