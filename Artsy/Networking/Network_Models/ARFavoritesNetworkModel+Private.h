#import "ARFavoritesNetworkModel.h"

@class AFHTTPRequestOperation;

@interface ARFavoritesNetworkModel ()
@property (readwrite, nonatomic, assign) BOOL allDownloaded;
@property (atomic, weak) AFHTTPRequestOperation *currentRequest;
@property (readwrite, nonatomic, assign) NSInteger currentPage;
@end
