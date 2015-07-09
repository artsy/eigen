/// The ARNavigationContainer protocol is a way of abstracting out
/// the navigation stack with the interface, you can experiment
/// with any UI as long as you respond to these methods.

@protocol ARNavigationContainer <NSObject>

- (void)loadFeed;

- (void)startLoading;
- (void)stopLoading;

@end
