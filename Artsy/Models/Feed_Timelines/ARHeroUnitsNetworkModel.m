#import "ARHeroUnitsNetworkModel.h"
#import "ArtsyAPI+Private.h"

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

- (void)getHeroUnitsWithSuccess:(void (^)(NSArray *heroUnits))success failure:(void (^)(NSError *error))failure
{
    if (self.isLoading) {
        return;
    }

    self.isLoading = YES;
    @_weakify(self);

    // This is generally one of the first networking calls, lets make sure it comes through.

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        [ArtsyAPI getSiteHeroUnits:^(NSArray *heroUnits) {

            @_strongify(self);
            self.isLoading = NO;

            NSArray *filteredHeroUnits = [heroUnits select:^BOOL(SiteHeroUnit *unit) {
                return unit.isCurrentlyActive;
            }];

            self.heroUnits = filteredHeroUnits;

            if (success) {
                success(self.heroUnits);
            }

        } failure:^(NSError *error) {
            @_strongify(self);
            ARErrorLog(@"There was an error getting Hero Units: %@", error.localizedDescription);
            self.isLoading = NO;
            if (failure) {
                failure(error);
            }
        }];
    } failure:^(NSError *error) {
        @_strongify(self);
        ARErrorLog(@"There was an error getting Hero Units: %@", error.localizedDescription);
        self.isLoading = NO;
        if (failure) {
            failure(error);
        }
    }];
}

@end
