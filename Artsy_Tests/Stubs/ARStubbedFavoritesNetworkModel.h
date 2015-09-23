#import "ARFavoritesNetworkModel.h"

@interface ARStubbedFavoritesNetworkModel : ARFavoritesNetworkModel

@property (readonly, nonatomic, copy) NSArray *favoritesStack;

/// This should be an array of nested model arrays. Each nested model array represents a `page`. The network model is
/// considered `allDownloaded` once the last nested model array has been popped from the stack.
- (instancetype)initWithFavoritesStack:(NSArray *)favoritesStack;

@end
