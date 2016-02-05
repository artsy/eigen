#import "ARSearchViewController.h"

@class ARFairSearchViewController, Fair;

@protocol ARFairSearchViewControllerDelegate <NSObject>
- (void)selectedResult:(SearchResult *)result ofType:(NSString *)type fromQuery:(NSString *)query;

@optional
- (void)cancelledSearch:(ARFairSearchViewController *)controller;
@end


@interface ARFairSearchViewController : ARSearchViewController

- (instancetype)initWithFair:(Fair *)fair;

@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, weak, readwrite) id<ARFairSearchViewControllerDelegate> delegate;

- (NSArray *)searchPartners:(NSString *)query;

@end
