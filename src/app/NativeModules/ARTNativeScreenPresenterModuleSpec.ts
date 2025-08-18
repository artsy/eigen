import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'

export interface Spec extends TurboModule {
  presentAugmentedRealityVIR(
    imgUrl: string, 
    width: number, 
    height: number, 
    artworkSlug: string, 
    artworkId: string
  ): void
  presentMediaPreviewController(
    reactTag: number, 
    route: string, 
    mimeType: string, 
    cacheKey: string | null
  ): void
}

export default TurboModuleRegistry.getEnforcing<Spec>('ARTNativeScreenPresenterModule')