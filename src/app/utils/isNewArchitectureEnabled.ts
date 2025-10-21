// Check if the global `nativeFabric` object exists.
// Its presence indicates that Fabric is running.
// @ts-expect-error nativeFabricUIManager is only available in the new architecture and isn't typed yet
export const isNewArchitectureEnabled = !!global.nativeFabricUIManager
