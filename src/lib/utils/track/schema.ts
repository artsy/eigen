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
  context_screen_owner_type: OwnerEntityTypes | null
}

export enum PageNames {
  AboutTheFairPage = "AboutTheFair",
  AboutTheShowPage = "AboutTheShow",
  AllArtistSeriesPage = "AllArtistSeries",
  ArtistPage = "Artist",
  ArtistSeriesPage = "ArtistSeries",
  ArtworkClassificationsPage = "ArtworkClassifications",
  ArtworkPage = "Artwork",
  Auction = "Auction",
  AuctionInfo = "AuctionInfo",
  Auctions = "Auctions",
  BidFlowBillingAddressPage = "YourBillingAddress",
  BidFlowConfirmBidPage = "ConfirmYourBid",
  BidFlowMaxBidPage = "YourMaxBid",
  BidFlowRegistration = "Registration",
  BidFlowRegistrationResultConfirmed = "RegistrationConfirmed",
  BidFlowRegistrationResultError = "RegistrationError",
  BidFlowRegistrationResultPending = "RegistrationPending",
  BMWFairActivation = "BMWFairActivation",
  CityGuide = "CityGuideGuide",
  CityGuideBMWList = "CityGuideBMWList",
  CityGuideClosingSoonList = "CityGuideClosingSoonList",
  CityGuideFairsList = "CityGuideFairsList",
  CityGuideGalleriesList = "CityGuideGalleriesList",
  CityGuideMap = "CityGuideMap",
  CityGuideMuseumsList = "CityGuideMuseumsList",
  CityGuideOpeningSoonList = "CityGuideOpeningSoonList",
  CityGuideSavedList = "CityGuideSavedList",
  CityPicker = "CityPicker",
  Collection = "Collection",
  ConsignmentsOverView = "ConsignmentsOverview",
  ConsignmentsSubmission = "ConsignmentsSubmit",
  ConsignmentsWelcome = "ConsignmentsWelcome",
  ConversationPage = "Conversation",
  FairAllArtistsPage = "FairAllArtistsPage",
  FairAllArtworksPage = "FairAllArtworksPage",
  FairAllExhibitorsPage = "FairAllExhibitorsPage",
  FairBoothPage = "FairBoothPage",
  FairPage = "Fair",
  GenePage = "Gene",
  Home = "Home",
  InboxPage = "Inbox",
  InquiryPage = "Inquiry",
  PartnerPage = "PartnerPage",
  SavesAndFollows = "SavesAndFollows",
  Search = "Search",
  Sell = "Sell",
  ShowAllArtists = "ShowAllArtists",
  ShowAllArtworks = "ShowAllArtworks",
  ShowPage = "Show",
  ViewingRoom = "ViewingRoom",
  ViewingRoomArtworkPage = "ViewingRoomArtworkPage",
  ViewingRoomArtworks = "ViewingRoomArtworks",
  ViewingRoomsList = "ViewingRoomsList",
  WorksForYou = "WorksForYou",
  Fair2Page = "Fair",
  Fair2MoreInfoPage = "moreInfo",
  Show2Page = "Show",
  Show2MoreInfoPage = "moreInfo",
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
  Consignment = "ConsignmentSubmission",
  Conversation = "Conversation",
  Gallery = "Gallery",
  Gene = "Gene",
  Home = "home",
  Fair = "Fair",
  Fair2MoreInfo = "moreInfo",
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
  Impression = "impression",

  /**
   * Parameters changed
   */
  ChangeFilterParams = "commercial_filter_params_changed",

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
  ArtistAbout = "artistAbout",
  ArtistFollow = "artistFollow",
  ArtistUnfollow = "artistUnfollow",
  ArtistWorks = "artistWorks",
  ArtistShows = "artistShows",
  ArtistConsignGetStarted = "Get Started",

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
  IdentityVerificationFAQ = "identityVerificationFAQ",
  Bid = "bid",
  ConditionsOfSale = "conditionsOfSale",
  ConsignWithArtsy = "consignWithArtsy",
  EnterLiveBidding = "enterLiveBidding",
  FollowPartner = "followPartner",
  GridArtwork = "gridArtwork",
  IncreaseMaxBid = "increaseMaxBid",
  LotViewed = "lotViewed",
  ReadMore = "readMore",
  RegisterToBid = "registerToBid",
  RequestConditionReport = "requestConditionReport",
  Share = "share",
  ShowMoreArtworksDetails = "showMoreArtworksDetails",
  ViewAll = "viewAll",
  ViewInRoom = "viewInRoom",
  WatchLiveBidding = "watchLiveBidding",

  /**
   * City and Map Page Events
   */
  GetBMWArtGuide = "getBMWArtGuide",
  CityGuideSessionLength = "cityGuideSessionLength",

  /**
   * Gene Page Events
   */
  GeneAbout = "geneAbout",
  GeneFollow = "geneFollow",
  GeneUnfollow = "geneUnfollow",
  GeneWorks = "geneWorks",
  Refine = "geneRefine",

  /**
   * Home page events
   */
  HomeArtistRailFollow = "homeArtistRailFollow",
  HomeArtistArtworksBlockFollow = "homeArtistArtworksBlockFollow",

  /**
   * Conversations / Inbox / Messaging Events
   */
  ConversationSelected = "conversationSelected",
  ConversationSendReply = "conversationSendReply",
  ConversationAttachmentShow = "conversationAttachmentShow",
  ConversationAttachmentArtwork = "conversationAttachmentArtwork",
  ConversationAttachmentInvoice = "conversationAttachmentInvoice",
  ConversationLink = "conversationLinkUsed",
  InquiryCancel = "inquiryCancel",
  InquirySend = "inquirySend",

  /**
   *  Saves And Follows Events
   */
  SavesAndFollowsWorks = "savesAndFollowsWorks",
  SavesAndFollowsArtists = "savesAndFollowsArtists",
  SavesAndFollowsCategories = "savesAndFollowsCategories",
  SavesAndFollowsFairs = "savesAndFollowsFairs",
  SavesAndFollowsShows = "savesAndFollowsShows",

  /**
   *  City guide
   */
  BMWLogo = "bmwLogo",
  OpenShow = "openShow",
  OpenBMWShow = "openBMWShow",
  UnsaveBMWShow = "unsaveBMWShow",
  SaveBMWShow = "saveBMWShow",
  ClusteredMapPin = "clusteredMapPin",
  SingleMapPin = "singleMapPin",
  AllTab = "allTab",
  SavedTab = "savedTab",
  FairsTab = "fairsTab",
  GalleriesTab = "galleriesTab",
  MuseumsTab = "museumsTab",

  /**
   *  Consignment flow
   */
  ConsignmentDraftCreated = "consignmentDraftCreated",
  ConsignmentSubmitted = "consignmentSubmitted",

  /**
   * Commercial flow
   */
  BidFlowAddBillingAddress = "addBillingAddress",
  BidFlowPlaceBid = "placeBid",
  BidFlowSaveBillingAddress = "saveBillingAddress",
  BuyNow = "buyNow",
  ContactGallery = "contactGallery",
  MakeOffer = "makeOffer",

  /**
   * Show flow
   */
  SingleShowMap = "singleShowMap",
  CarouselSwipe = "carouselSwipe",
  SaveShow = "saveShow",
  UnsaveShow = "unsaveShow",
  ToggleHours = "toggleHours",
  NearbyShow = "nearbyShow",
  GallerySite = "gallerySite",

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
  // dispatch this on search input focus and again any time they type
  ARAnalyticsSearchStartedQuery = "Searched",
  ARAnalyticsSearchItemSelected = "Selected result from search screen",
  ARAnalyticsSearchRecentItemSelected = "selected_recent_item_from_search",

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
  ArtistConsignment = "ArtistConsignment",
  ArtistInsights = "ArtistInsights",
  ArtworkActions = "ArtworkActions",
  ArtworkDetails = "ArtworkDetails",
  ArtworkExtraLinks = "ArtworkExtraLinks",
  ArtworkGrid = "ArtworkGrid",
  ArtworkHistory = "ArtworkHistory",
  ArtworkImage = "ArtworkImage",
  ArtworkRecentlySoldGrid = "artworkRecentlySoldGrid",
  ArtistSeriesRail = "artistSeriesRail",
  FeaturedCollectionsRail = "curatedHighlightsRail",
  ArtworkTombstone = "ArtworkTombstone",
  Bibliography = "Bibliography",
  Collection = "Collection",
  CollectionDescription = "CollectionDescription",
  CommercialButtons = "CommercialButtons",
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
