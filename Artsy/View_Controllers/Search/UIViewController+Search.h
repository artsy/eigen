#import <UIKit/UIKit.h>

@class SearchResult, Fair;

NS_ASSUME_NONNULL_BEGIN

@interface UIViewController (Search)

- (void)presentSearchResult:(SearchResult *)searchResult fair:(Fair *)fair;

@end

NS_ASSUME_NONNULL_END
