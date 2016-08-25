@import UIKit;

/// Handles the migration to-and from different status bar types
/// when jumpoing between "old style" black bar status bars
/// and "new style" black status bars with white content behind.


@interface ARSerifStatusMaintainer : NSObject

- (void)viewWillAppear:(BOOL)animated app:(UIApplication *_Nullable)app;
- (void)viewWillDisappear:(BOOL)animated app:(UIApplication *_Nullable)app;

@end
