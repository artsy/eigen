import { findNodeHandle, NativeModules } from "react-native"
const { ARSwitchBoardModule } = NativeModules

function presentNavigationViewController(component: React.Component<any, any>, route: string) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in presentNavigationViewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.presentNavigationViewController(reactTag, route)
}

export enum EntityType {
  Partner = "partner",
  Fair = "fair",
}

export enum SlugType {
  ProfileID = "profileID",
  FairID = "fairID",
}

/**
 * Looks up the entity by slug passed in and presents appropriate viewController
 * @param component: ignored, kept for compatibility
 * @param slug: identifier for the entity to be presented
 * @param entity: type of entity we are routing to, this is currently used to determine what loading
 * state to show, either 'fair' or 'partner'
 * @param slugType: type of slug or id being passed, this determines how the entity is looked up
 * in the api, if we have a fairID we can route directly to fair component and load the fair, if
 * we have a profileID we must first fetch the profile and find the ownerType which can be a fair
 * partner or other.
 */
function presentEntityViewController(
  component: React.Component<any, any>,
  slug: string,
  entity: EntityType,
  slugType: SlugType
) {
  const routeWithEntityParam = slug + "?entity=" + entity + "&slugType=" + slugType
  presentNavigationViewController(component, routeWithEntityParam)
}

function presentPartnerViewController(component: React.Component<any, any>, slug: string) {
  presentEntityViewController(component, slug, EntityType.Partner, SlugType.ProfileID)
}

function presentFairViewController(component: React.Component<any, any>, slug: string, slugType?: SlugType) {
  presentEntityViewController(component, slug, EntityType.Fair, slugType ?? SlugType.FairID)
}

function presentModalViewController(component: React.Component<any, any>, route: string) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in presentModalViewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.presentModalViewController(reactTag, route)
}

function presentMediaPreviewController(
  component: React.Component<any, any>,
  route: string,
  mimeType: string,
  cacheKey?: string
) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in presentMediaPreviewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.presentMediaPreviewController(reactTag, route, mimeType, cacheKey)
}

function dismissModalViewController(component: React.Component<any, any>) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in dismissModalViewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.dismissModalViewController(reactTag)
}

function dismissNavigationViewController(component: React.Component<any, any>) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in dismissNavigationViewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.dismissNavigationViewController(reactTag)
}

function presentEmailComposer(component: React.Component<any, any>, to: string, subject: string, body?: string) {
  let reactTag
  try {
    reactTag = findNodeHandle(component)
  } catch (err) {
    console.error(`Unable to find tag in dismissNavigationViewController: ${err.message}`)
    return
  }

  ARSwitchBoardModule.presentEmailComposer(reactTag, to, subject, body)
}

function updateShouldHideBackButton(hideBackButton: boolean) {
  ARSwitchBoardModule.updateShouldHideBackButton(hideBackButton)
}
export default {
  presentEmailComposer,
  presentNavigationViewController,
  presentMediaPreviewController,
  presentModalViewController,
  presentPartnerViewController,
  presentFairViewController,
  dismissModalViewController,
  dismissNavigationViewController,
  updateShouldHideBackButton,
}
