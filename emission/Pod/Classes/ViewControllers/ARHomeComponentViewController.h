#import <Emission/ARComponentViewController.h>

@class ARGraphQLQuery;

NS_ASSUME_NONNULL_BEGIN

// When changing this, be sure to adjust the implementation of +preloadQueriesWithSelectedArtist:tab:
typedef enum ARHomeTabType {
    ARHomeTabArtists,
    ARHomeTabForYou,
    ARHomeTabAuctions
} ARHomeTabType;

@interface ARHomeComponentViewController : ARComponentViewController

@property (nonatomic, strong, readonly) NSString *selectedArtist;

- (void)changeHomeTabTo:(ARHomeTabType)tab;

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithSelectedArtist:(nullable NSString *)artistID
                                                            tab:(ARHomeTabType)selectedTab;

- (instancetype)initWithSelectedArtist:(nullable NSString *)artistID
                                   tab:(ARHomeTabType)selectedTab
                              emission:(nullable AREmission*)emission NS_DESIGNATED_INITIALIZER;


- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
