#import "SearchResult.h"

@interface ARSearchResultsDataSource : NSObject<UITableViewDataSource>

@property (nonatomic) NSOrderedSet *searchResults;
@property (nonatomic, readwrite, strong) UIColor *textColor;
@property (nonatomic, readwrite, strong) UIImage *placeholderImage;

- (SearchResult *)objectAtIndex:(NSInteger)index;

@end