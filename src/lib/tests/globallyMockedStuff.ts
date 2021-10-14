import { postEventToProviders } from "lib/utils/track/providers"

export const mockPostEventToProviders = postEventToProviders as jest.MockedFunction<typeof postEventToProviders>
