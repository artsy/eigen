#import <React/RCTScrollView.h>

@interface RCTScrollView (RCTEnclosingScrollView)
- (void)optOutOfParentScrollEvents;
- (void)optOutOfAllScrollEvents;
- (void)optInToAllScrollEvents;
@end
