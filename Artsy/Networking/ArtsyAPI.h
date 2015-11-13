


@interface ArtsyAPI : NSObject

/// Gets a temporary Xapp token asyncronously, or if the user has one will run syncronously
+ (void)getXappTokenWithCompletion:(void (^)(NSString *xappToken, NSDate *expirationDate))callback;

/// Gets a temporary Xapp token asyncronously, or if the user has one will run syncronously
+ (void)getXappTokenWithCompletion:(void (^)(NSString *xappToken, NSDate *expirationDate))callback failure:(void (^)(NSError *error))failure;

@end

#import "ArtsyAPI+Artworks.h"
#import "ArtsyAPI+Browse.h"
#import "ArtsyAPI+CurrentUserFunctions.h"
#import "ArtsyAPI+DeviceTokens.h"
#import "ArtsyAPI+Feed.h"
#import "ArtsyAPI+Following.h"
#import "ArtsyAPI+Profiles.h"
#import "ArtsyAPI+Posts.h"
#import "ArtsyAPI+Artists.h"
#import "ArtsyAPI+Genes.h"
#import "ArtsyAPI+ListCollection.h"
#import "ArtsyAPI+RelatedModels.h"
#import "ArtsyAPI+SiteFunctions.h"
#import "ArtsyAPI+Search.h"
#import "ArtsyAPI+Sales.h"
#import "ArtsyAPI+Fairs.h"
#import "ArtsyAPI+OrderedSets.h"
#import "ArtsyAPI+Shows.h"
#import "ArtsyAPI+SystemTime.h"
#import "ArtsyAPI+ErrorHandlers.h"
