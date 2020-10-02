import { dismissModal, goBack, navigate } from "lib/navigation/navigate"

function presentNavigationViewController(_component: React.Component<any, any>, route: string) {
  navigate(route)
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

function presentModalViewController(_component: React.Component<any, any>, route: string) {
  navigate(route, { modal: true })
}

function dismissModalViewController(_component: React.Component<any, any>) {
  dismissModal()
}

function dismissNavigationViewController(_component: React.Component<any, any>) {
  goBack()
}

export default {
  presentNavigationViewController,
  presentModalViewController,
  presentPartnerViewController,
  dismissModalViewController,
  dismissNavigationViewController,
}
