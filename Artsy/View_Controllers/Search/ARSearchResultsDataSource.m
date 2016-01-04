#import "ARSearchResultsDataSource.h"
#import <AFNetworking/UIImageView+AFNetworking.h>


@implementation ARSearchResultsDataSource

- (id)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _placeholderImage = [UIImage imageNamed:@"SearchThumb_LightGrey"];

    return self;
}

- (NSInteger)tableView:(UITableView *)aTableView numberOfRowsInSection:(NSInteger)section
{
    return self.searchResults.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"SearchCell"];
    SearchResult *result = self.searchResults[indexPath.row];

    BOOL published = result.isPublished.boolValue;
    if (!published) {
        cell.textLabel.text = [result.displayText stringByAppendingString:@" (unpublished)"];
    } else {
        cell.textLabel.text = result.displayText;
    }

    cell.textLabel.textColor = self.textColor ?: [UIColor whiteColor];

    __weak typeof(cell) wcell = cell;

    [cell.imageView setImageWithURLRequest:result.imageRequest placeholderImage:self.placeholderImage
                                   success:^(NSURLRequest *request, NSHTTPURLResponse *response, UIImage *image) {
       __strong typeof (wcell) cell = wcell;
       cell.imageView.image = image;
       [cell layoutSubviews];

                                   }
                                   failure:nil];

    return cell;
}

- (SearchResult *)objectAtIndex:(NSInteger)index
{
    return self.searchResults[index];
}

@end
