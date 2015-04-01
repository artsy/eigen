#import <WatchKit/WatchKit.h>
#import <Foundation/Foundation.h>

@interface WKInterfaceImage(Async)

- (void)ar_asyncSetImageURL:(NSURL *)url;
- (void)ar_asyncSetImageURL:(NSURL *)url completion:(void (^)())completion;

@end
