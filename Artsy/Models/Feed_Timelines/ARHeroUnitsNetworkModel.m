#import "ARHeroUnitsNetworkModel.h"
#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+SiteFunctions.h"

#import "SiteHeroUnit.h"

static NSString *ARHeroUnitsDataSourceItemsKey = @"ARHeroUnitsDataSourceItemsKey";


@interface ARHeroUnitsNetworkModel ()
@property (nonatomic, copy, readwrite) NSArray *heroUnits;
@property (nonatomic, assign) BOOL isLoading;
@end


@implementation ARHeroUnitsNetworkModel

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    self.isLoading = NO;

    return self;
}

- (void)downloadHeroUnits
{
    [self getHeroUnitsWithSuccess:nil failure:nil];
}

- (void)getHeroUnitsWithSuccess:(void (^)(NSArray *heroUnits))success failure:(void (^)(NSError *error))failure
{
    if (self.isLoading) {
        return;
    }

    self.isLoading = YES;
    __weak typeof (self) wself = self;

    // This is generally one of the first networking calls, lets make sure it comes through.

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        [ArtsyAPI getSiteHeroUnits:^(NSArray *heroUnits) {

            __strong typeof (wself) sself = wself;
            sself.isLoading = NO;

            NSArray *filteredHeroUnits = [heroUnits select:^BOOL(SiteHeroUnit *unit) {
                return unit.isCurrentlyActive;
            }];

            sself.heroUnits = filteredHeroUnits;

            if (success) {
                success(sself.heroUnits);
            }

        } failure:^(NSError *error) {
            __strong typeof (wself) sself = wself;
            ARErrorLog(@"There was an error getting Hero Units: %@", error.localizedDescription);
            sself.isLoading = NO;
            if (failure) {
                failure(error);
            }
        }];
    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        ARErrorLog(@"There was an error getting Hero Units: %@", error.localizedDescription);
        sself.isLoading = NO;
        if (failure) {
            failure(error);
        }
    }];
}

@end
