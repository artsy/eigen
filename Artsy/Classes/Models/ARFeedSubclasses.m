#import "ARAppBackgroundFetchDelegate.h"


@interface ARFeed ()
- (NSOrderedSet *)parseItemsFromJSON:(NSDictionary *)result;
@end


@interface ARFileFeed ()
@property (nonatomic, copy) id JSON;
@end


@implementation ARFileFeed

- (instancetype)initWithNamedFile:(NSString *)fileName
{
    self = [super init];
    if (!self) {
        return nil;
    }

    NSData *data = [NSData dataWithContentsOfFile:[[NSBundle mainBundle] pathForResource:fileName ofType:@"json"]];
    NSError *error = nil;
    _JSON = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&error];

    return self;
}

- (void)getFeedItemsWithCursor:(NSString *)cursor success:(void (^)(NSOrderedSet *))success failure:(void (^)(NSError *))failure
{
    if (success) {
        dispatch_async(dispatch_get_main_queue(), ^{
            success([self parseItemsFromJSON:self.JSON]);
        });
    }
}

@end


////////////////////////


@interface ARShowFeed ()
@property (nonatomic, assign) BOOL parsing;
@end


@implementation ARShowFeed

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    //NSString *fetchBackgroundFilePath = [ARAppBackgroundFetchDelegate pathForDownloadedShowFeed];
    //self.JSON = [NSKeyedUnarchiver unarchiveObjectWithFile:fetchBackgroundFilePath];

    return self;
}


- (void)getFeedItemsWithCursor:(NSString *)cursor success:(void (^)(NSOrderedSet *))success failure:(void (^)(NSError *))failure
{
    @weakify(self);
    if (self.JSON) {
        // We may get asked multiple times before we finished extracting the data

        if (self.parsing) {
            return;
        }

        self.parsing = YES;

        // If we've background fetch'd a copy of the feed, we should use that on the first grab of show data

        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            @strongify(self);
            NSOrderedSet *items = [self parseItemsFromJSON:self.JSON];

            dispatch_async(dispatch_get_main_queue(), ^{
                success(items);
            });

            [[NSFileManager defaultManager] removeItemAtPath:[ARAppBackgroundFetchDelegate pathForDownloadedShowFeed] error:nil];
            self.JSON = nil;
        });

        return;
    }

    NSInteger pageSize = (cursor) ? 4 : 1;
    [ArtsyAPI getFeedResultsForShowsWithCursor:cursor pageSize:pageSize success:^(id JSON) {
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            @strongify(self);
            NSOrderedSet *items = [self parseItemsFromJSON:JSON];
            dispatch_async(dispatch_get_main_queue(), ^{
                success(items);
            });
        });

    } failure:failure];
}

@end


////////////////////////


@interface ARProfileFeed ()
@property (nonatomic, strong) Profile *profile;
@end


@implementation ARProfileFeed

- (instancetype)initWithProfile:(Profile *)profile
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _profile = profile;
    return self;
}

- (void)getFeedItemsWithCursor:(NSString *)cursor success:(void (^)(NSOrderedSet *))success failure:(void (^)(NSError *))failure
{
    @weakify(self);
    [ArtsyAPI getFeedResultsForProfile:self.profile withCursor:cursor success:^(id JSON) {
        @strongify(self);
        success([self parseItemsFromJSON:JSON]);
    } failure:failure];
}

@end


////////////////////////


@interface ARFairOrganizerFeed ()
@property (nonatomic, strong) FairOrganizer *fairOrganizer;
@end


@implementation ARFairOrganizerFeed

- (instancetype)initWithFairOrganizer:(FairOrganizer *)fairOrganizer
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _fairOrganizer = fairOrganizer;
    return self;
}

- (void)getFeedItemsWithCursor:(NSString *)cursor success:(void (^)(NSOrderedSet *))success failure:(void (^)(NSError *))failure
{
    @weakify(self);
    [ArtsyAPI getFeedResultsForFairOrganizer:self.fairOrganizer withCursor:cursor success:^(id JSON) {
        ar_dispatch_async(^{
            @strongify(self);
            NSOrderedSet *items = [self parseItemsFromJSON:JSON];

            ar_dispatch_main_queue(^{
                success(items);
            });
        });
    } failure:failure];
}

@end


////////////////////////


@interface ARFairShowFeed ()
@property (nonatomic, strong) Fair *fair;
@property (nonatomic, strong) Partner *partner;
@end


@implementation ARFairShowFeed

- (instancetype)initWithFair:(Fair *)fair
{
    return [self initWithFair:fair partner:nil];
}

- (instancetype)initWithFair:(Fair *)fair partner:(Partner *)partner
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _fair = fair;
    _partner = partner;
    return self;
}

- (void)getFeedItemsWithCursor:(NSString *)cursor success:(void (^)(NSOrderedSet *))success failure:(void (^)(NSError *))failure
{
    @weakify(self);

    [ArtsyAPI getFeedResultsForFairShows:self.fair partnerID:self.partner.partnerID withCursor:cursor success:^(id JSON) {
        ar_dispatch_async(^{
            @strongify(self);

            NSOrderedSet *items = [self parseItemsFromJSON:JSON];

            ar_dispatch_main_queue(^{
                success(items);
            });
        });
    } failure:failure];
}

@end
