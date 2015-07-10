#import <Foundation/Foundation.h>
#import "WatchBiddingDetails.h"

typedef NS_ENUM(NSInteger, ARWatchMessageRequest) {
    ARWatchMessageRequestFavorites,
    ARWatchMessageRequestRecommended,
    ARWatchMessageRequestBid,
    ARWatchMessageRequestShows,
    ARWatchMessageRequestWorksForYou
};

/// A communication object that represents messages
/// sent between the watch and the app

/// - As the app is backgrounded, it does not have
/// access to it's own auth token, but the watch does
/// so it also comes along.


@interface WatchMessage : NSObject

- (instancetype)initWithDictionary:(NSDictionary *)dictionary;
- (NSDictionary *)dictionaryRepresentation;

/// Auth token from the watches (open) keychain
@property (readonly, nonatomic, copy) NSString *authenticationToken;

/// Either a dictionary or an array of items
@property (readonly, nonatomic, strong) id referenceObject;

/// What is this message about
@property (readonly, nonatomic, assign) enum ARWatchMessageRequest action;

/// Something went wrong
@property (readonly, nonatomic, strong) id error;

@end


@interface WatchMessage (Messages)
+ (WatchMessage *)messageToRequestFavorites;
+ (WatchMessage *)messageToRequestBidWithDetails:(WatchBiddingDetails *)details;
+ (WatchMessage *)messageToRequestRecommended;
+ (WatchMessage *)messageToRequestWorksForYou;
+ (WatchMessage *)messageToRequestShows;

+ (WatchMessage *)messageWithArtworks:(NSArray *)artworks;
+ (WatchMessage *)messageWithShows:(NSArray *)artworks;
+ (WatchMessage *)messageWithBidStatus:(enum ARWatchBiddingStatus)status;

/// Cannot send NSErrors between devices, so it's strings.
+ (WatchMessage *)messageWithError:(NSString *)error;
@end
