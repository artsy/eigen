#import "ARFairComponentViewController.h"
#import "AREmission.h"
#import "ARGraphQLQueryPreloader.h"

@interface ARFairComponentViewController ()

@end


@implementation ARFairComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithFairID:(NSString *)fairID;
{
   NSDictionary *variables = @{
       @"fairID": fairID,
   };
   return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersFairQuery" variables:variables]];
}

- (instancetype)initWithFairID:(NSString *)fairID
{
    return [self initWithFairID:fairID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithFairID:(NSString *)fairID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"Fair" initialProperties:@{ @"fairID": fairID }];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self.view addConstraints:@[
                                [NSLayoutConstraint constraintWithItem:self.rootView
                                                             attribute:NSLayoutAttributeTop
                                                             relatedBy:NSLayoutRelationEqual
                                                                toItem:self.view
                                                             attribute:NSLayoutAttributeTop
                                                            multiplier:1
                                                              constant:0]
                                ]];
}


@end
