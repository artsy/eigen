// TODO: This file and the types here can be removed once everything is moved to cohesion.
import { OwnerType } from "@artsy/cohesion"
/**
 * Useful notes:
 *  * At the bottom of this file there is an example of how to test track'd code.
 */

/**
 * The global tracking-info keys in Artsy’s schema.
 */
export interface Global {
  /**
   * The name of an event.
   *
   * Options are: Tap, Fail, Success
   *
   * This is unique to a "Track" event, meaning a "screen view" in Segment does not have this
   * This is how we distinguish the two type of events in Eigen
   * Track data inherits the screen view (called "context_screen") properties
   *
   */
  action_type: ActionTypes

  /**
   * The discription of an event
   *
   * E.g. Conversation artwork attachment tapped
   */
  action_name: ActionNames

  session_length?: number

  /**
   * OPTIONAL: Additional properties of the action
   */
  additional_properties?: object
}

export interface Entity extends Global {
  /**
   * The ID of the entity in its database. E.g. the Mongo ID for entities that reside in Gravity.
   */
  owner_id?: string

  /**
   * The public slug for this entity.
   */
  owner_slug?: string

  /**
   * The type of entity, e.g. Artwork, Artist, etc.
   */
  owner_type?: OwnerEntityTypes

  /**
   * Provides a context, usually the component the event is emitted from.
   */
  context_module?: string
}

export interface PageView {
  /**
   * The root container component should specify this as the screen context.
   */
  context_screen: PageNames

  /**
   * The public slug for the entity that owns this page (e.g. for the Artist page)
   */
  context_screen_owner_slug?: string

  /**
   * The ID of the entity in its database. E.g. the Mongo ID for entities that reside in Gravity.
   *
   * OPTIONAL: This may not always be available before the relay call for props has been made
   */
  context_screen_owner_id?: string

  /**
   * The type of entity (owner), E.g. Artist, Artwork, etc.
   */
  context_screen_owner_type: OwnerEntityTypes | OwnerType | null
}

export enum PageNames {
  AllArtistSeriesPage = "AllArtistSeries",
  ArticlePage = "Article",
  ArtistPage = "Artist",
  ArtistSeriesPage = "ArtistSeries",
  ArtworkPage = "Artwork",
  Auction = "Auction",
  AuctionInfo = "AuctionInfo",
  BidFlowBillingAddressPage = "YourBillingAddress",
  BidFlowPhoneNumberPage = "YourPhoneNumber",
  BidFlowConfirmBidPage = "ConfirmYourBid",
  BidFlowMaxBidPage = "YourMaxBid",
  BidFlowRegistration = "Registration",
  BidFlowRegistrationResultConfirmed = "RegistrationConfirmed",
  BidFlowRegistrationResultError = "RegistrationError",
  BidFlowRegistrationResultPending = "RegistrationPending",
  CityGuide = "CityGuideGuide",
  CityGuideClosingSoonList = "CityGuideClosingSoonList",
  CityGuideFairsList = "CityGuideFairsList",
  CityGuideGalleriesList = "CityGuideGalleriesList",
  CityGuideMap = "CityGuideMap",
  CityGuideMuseumsList = "CityGuideMuseumsList",
  CityGuideOpeningSoonList = "CityGuideOpeningSoonList",
  CityGuideSavedList = "CityGuideSavedList",
  CityPicker = "CityPicker",
  Collect = "Collect",
  Collection = "Collection",
  ConversationPage = "Conversation",
  GenePage = "Gene",
  TagPage = "Tag",
  Home = "Home",
  InquiryPage = "Inquiry",
  MyCollectionArtworkInsights = "myCollectionArtworkInsights",
  MyCollectionArtworkAbout = "myCollectionArtworkAbout",
  MyCollectionInsights = "myCollectionInsights",
  PartnerPage = "PartnerPage",
  SavesAndFollows = "SavesAndFollows",
  Search = "Search",
  ViewingRoom = "ViewingRoom",
  ViewingRoomArtworkPage = "ViewingRoomArtworkPage",
  ViewingRoomArtworks = "ViewingRoomArtworks",
  ViewingRoomsList = "ViewingRoomsList",
  FairPage = "Fair",
  FairMoreInfoPage = "Fair",
  ShowPage = "Show",
  ShowMoreInfoPage = "moreInfo",
  SavedSearchEdit = "SavedSearchEdit",
  SavedSearchList = "SavedSearchList",
}

export enum OwnerEntityTypes {
  AllArtistSeries = "AllArtistSeries",
  Artist = "Artist",
  ArtistSeries = "ArtistSeries",
  Artwork = "Artwork",
  AuctionInfo = "AuctionInfo",
  Auction = "Auction",
  CityGuide = "CityGuide",
  Collection = "Collection",
  Conversation = "Conversation",
  Gene = "Gene",
  Tag = "Tag",
  Home = "home",
  Fair = "Fair",
  FairMoreInfo = "moreInfo",
  MyCollectionInsights = "MyCollectionInsights",
  Partner = "Partner",
  Search = "Search",
  Show = "Show",
  ViewingRoom = "ViewingRoom",
}

export enum ActionTypes {
  /**
   * User actions
   */
  Tap = "tap",
  Swipe = "swipe",

  /**
   * Events / results
   */
  Fail = "fail",
  Success = "success",

  /**
   * Taps on specific entities
   */
  TappedCollectionGroup = "tappedCollectionGroup",
}

/**
 * Action event discriptors / names
 */
export enum ActionNames {
  /**
   * Artist Page Events
   */
  ArtistFollow = "artistFollow",
  ArtistUnfollow = "artistUnfollow",

  /**
   * Artwork Page Events
   */
  ArtworkClassification = "artworkClassification",
  ArtworkImageSwipe = "artworkImageSwipe",
  ArtworkImageZoom = "artworkImageZoom",
  ArtworkSave = "artworkSave",
  ArtworkUnsave = "artworkUnsave",
  AskASpecialist = "askASpecialist",
  AuctionsFAQ = "auctionsFAQ",
  FAQ = "FAQ",
  IdentityVerificationFAQ = "identityVerificationFAQ",
  ConditionsOfSale = "conditionsOfSale",
  EnterLiveBidding = "enterLiveBidding",
  FollowPartner = "followPartner",
  IncreaseMaxBid = "increaseMaxBid",
  LotViewed = "lotViewed",
  ReadMore = "readMore",
  RegisterToBid = "registerToBid",
  RequestConditionReport = "requestConditionReport",
  Share = "share",
  ViewAll = "viewAll",
  ViewInRoom = "viewInRoom",
  WatchLiveBidding = "watchLiveBidding",

  /**
   * Gene Page Events
   */
  GeneFollow = "geneFollow",
  GeneUnfollow = "geneUnfollow",

  /**
   * Home page events
   */
  HomeArtistRailFollow = "homeArtistRailFollow",

  /**
   * Conversations / Inbox / Messaging Events
   */
  ConversationSelected = "conversationSelected",
  ConversationSendReply = "conversationSendReply",
  ConversationAttachmentShow = "conversationAttachmentShow",
  ConversationAttachmentArtwork = "conversationAttachmentArtwork",
  ConversationLink = "conversationLinkUsed",
  InquiryCancel = "inquiryCancel",
  InquirySend = "inquirySend",
  InboxTab = "inboxTab",

  /**
   *  Saves And Follows Events
   */
  SavesAndFollowsWorks = "savesAndFollowsWorks",
  SavesAndFollowsArtists = "savesAndFollowsArtists",
  SavesAndFollowsCategories = "savesAndFollowsCategories",
  SavesAndFollowsShows = "savesAndFollowsShows",

  /**
   *  City guide
   */
  ClusteredMapPin = "clusteredMapPin",
  SingleMapPin = "singleMapPin",
  AllTab = "allTab",
  SavedTab = "savedTab",
  FairsTab = "fairsTab",
  GalleriesTab = "galleriesTab",
  MuseumsTab = "museumsTab",

  /**
   * Commercial flow
   */
  BidFlowAddBillingAddress = "addBillingAddress",
  BidFlowPlaceBid = "placeBid",
  BidFlowSaveBillingAddress = "saveBillingAddress",
  BidFlowSavePhoneNumber = "savePhoneNumber",
  ContactGallery = "contactGallery",

  /**
   * Show flow
   */
  SaveShow = "saveShow",
  UnsaveShow = "unsaveShow",
  NearbyShow = "nearbyShow",

  /**
   * Fair page events
   */
  ContextualGallery = "contextualGallery",
  AllBoothWorks = "allBoothWorks",
  BuyTickets = "buyTickets",
  FairSite = "fairSite",
  FilterMedium = "filterMedium",
  FilterPrice = "filterPrice",
  GalleryFollow = "galleryFollow",
  GalleryUnfollow = "galleryUnfollow",
  Search = "search",
  PressRelease = "pressRelease",

  /**
   * Fair and show shared page events
   */
  ContextualArtist = "contextualArtist",
  ArtistName = "artistName",
  ListGallery = "listGallery",

  /**
   * Search (names preserved from eigen for searchability)
   */
  ARAnalyticsSearchCleared = "Cleared input in search screen",
  // dispatch this when the user enters a query in search input
  ARAnalyticsSearchStartedQuery = "Searched",
  ARAnalyticsSearchItemSelected = "Selected result from search screen",
  ARAnalyticsSearchRecentItemSelected = "selected_recent_item_from_search",
  SelectedResultFromSearchScreen = "selectedResultFromSearchScreen",

  /**
   * Collection page events
   */
  ViewMore = "viewMore",

  /*
   * Viewing room events
   */
  TappedArtworkGroup = "tappedArtworkGroup",
  TappedViewWorksButton = "tappedViewWorksButton",
  TappedViewMoreDetails = "tappedViewMoreDetails",
  TappedViewingRoomGroup = "tappedViewingRoomGroup",
  BodyImpression = "bodyImpression",
}

/**
 * The component from which the action originates
 */
export enum ContextModules {
  AboutTheArtist = "AboutTheArtist",
  AboutTheWork = "AboutTheWork",
  AboutTheWorkFromSpecialist = "AboutTheWorkFromSpecialist",
  Auction = "Auction",
  ArtistBiography = "ArtistBiography",
  ArtworkActions = "ArtworkActions",
  ArtworkDetails = "ArtworkDetails",
  ArtworkExtraLinks = "ArtworkExtraLinks",
  ArtworkGrid = "ArtworkGrid",
  ArtworkImage = "ArtworkImage",
  ArtistSeriesRail = "artistSeriesRail",
  FeaturedCollectionsRail = "curatedHighlightsRail",
  ArtworkTombstone = "ArtworkTombstone",
  Bibliography = "Bibliography",
  Collection = "Collection",
  CollectionDescription = "CollectionDescription",
  ExhibitionHistory = "ExhibitionHistory",
  FeaturedArtists = "FeaturedArtists",
  PartnerContext = "PartnerContext",
  Provenance = "Provenance",
  ViewingRoomArtworkRail = "ViewingRoomArtworkRail",
  LatestViewingRoomsRail = "latestViewingRoomsRail",
  FeaturedViewingRoomsRail = "featuredViewingRoomsRail",
}

export enum Flow {
  AboutTheArtist = "AboutTheArtist",
  AboutTheCollection = "AboutTheCollection",
  AboutTheWork = "AboutTheWork",
  ArtworkDetails = "ArtworkDetails",
  FeaturedArtists = "FeaturedArtists",
  RecommendedArtworks = "RecommendedArtworks",
}
