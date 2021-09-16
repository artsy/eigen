#import <UIKit/UIKit.h>

@interface UIViewController (WithLoadedData)

/// This should be called once the VC is done loading the data it cares about. If a ‘with loaded data’ block is available, it will get run immediately. This should only be called once during the lifetime of a VC.
- (void)ar_setDataLoaded;

/// Returns whether or not the data the VC cares about is loaded.
- (BOOL)ar_isDataLoaded;

/// Immediately runs the given block if the data the VC cares about is already loaded, otherwise it is stored and ran once `ar_setDataLoaded` is called.
- (void)ar_withLoadedData:(dispatch_block_t)block;

@end
