#import "WatchMessage.h"
#import "ARDefaults.h"
#import "UICKeyChainStore.h"


@interface WatchMessage ()
@end


@implementation WatchMessage

- (instancetype)initWithDictionary:(NSDictionary *)dictionary
{
    self = [super init];
    if (!self) return nil;

    _referenceObject = dictionary[@"object"];
    _action = [dictionary[@"action"] integerValue];
    _authenticationToken = dictionary[@"token"];
    _error = dictionary[@"error"];

    return self;
}

- (NSDictionary *)dictionaryRepresentation;
{
    /// NSNulls cannot be sent through, so absence can be presumed by -1

    return @{
        @"object" : self.referenceObject ?: @(-1),
        @"action" : @(self.action),
        @"token" : self.authenticationToken ?: @(-1),
        @"error" : self.error ?: @(-1)
    };
}

+ (NSString *)getAuthenticationToken
{
    NSString *service = [[NSBundle mainBundle] bundleIdentifier];
    service = [service stringByReplacingOccurrencesOfString:@".watchkitextension" withString:@""];
    return [UICKeyChainStore stringForKey:AROAuthTokenDefault service:service accessGroup:@"group.net.artsy.eigen"];
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"<WatchMessage action:%@ hasToken:%d hasObject: %d hasError %d", @(self.action), (self.authenticationToken != nil), (self.referenceObject != nil), (self.error != nil)];
}

@end


@implementation WatchMessage (Messages)

+ (WatchMessage *)messageToRequestFavorites
{
    return [self _messageWithMessageRequest:ARWatchMessageRequestFavorites];
}

+ (WatchMessage *)messageToRequestRecommended
{
    return [self _messageWithMessageRequest:ARWatchMessageRequestRecommended];
}

+ (WatchMessage *)messageToRequestShows
{
    return [self _messageWithMessageRequest:ARWatchMessageRequestShows];
}

+ (WatchMessage *)messageToRequestWorksForYou
{
    return [self _messageWithMessageRequest:ARWatchMessageRequestWorksForYou];
}


+ (WatchMessage *)_messageWithMessageRequest:(enum ARWatchMessageRequest)request
{
    return [[WatchMessage alloc] initWithDictionary:@{
        @"action" : @(request),
        @"token" : [self getAuthenticationToken] ?: @(-1),
    }];
}

+ (WatchMessage *)messageToRequestBidWithDetails:(WatchBiddingDetails *)details
{
    return [[WatchMessage alloc] initWithDictionary:@{
        @"action" : @(ARWatchMessageRequestBid),
        @"object" : [details dictionaryRepresentation],
        @"token" : [self getAuthenticationToken] ?: @(-1),
    }];
}

+ (WatchMessage *)messageWithArtworks:(NSArray *)artworks
{
    return [WatchMessage _messageWithObject:artworks];
}

+ (WatchMessage *)messageWithShows:(NSArray *)artworks
{
    return [[WatchMessage alloc] initWithDictionary:@{
        @"action" : @(ARWatchMessageRequestShows),
        @"object" : artworks
    }];
}

+ (WatchMessage *)messageWithBidStatus:(enum ARWatchBiddingStatus)status
{
    return [WatchMessage _messageWithObject:@(status)];
}

+ (WatchMessage *)_messageWithObject:(id)object
{
    return [[WatchMessage alloc] initWithDictionary:@{
        @"object" : object,
    }];
}

+ (WatchMessage *)messageWithError:(NSString *)error
{
    return [[WatchMessage alloc] initWithDictionary:@{
        @"error" : error,
    }];
}

@end
