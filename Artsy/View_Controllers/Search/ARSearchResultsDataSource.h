#import <UIKit/UIKit.h>

#import "SearchResultable.h"


@interface ARSearchResultsDataSource : NSObject <UITableViewDataSource>

@property (nonatomic) NSOrderedSet *searchResults;
@property (nonatomic, readwrite, strong) UIColor *textColor;
@property (nonatomic, readwrite, strong) UIImage *placeholderImage;

- (NSObject <SearchResultable> *)objectAtIndex:(NSInteger)index;

@end
