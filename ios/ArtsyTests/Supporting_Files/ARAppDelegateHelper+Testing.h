#import "ARAppDelegateHelper.h"

// Test support category for ARAppDelegateHelper
// This category provides methods to facilitate testing by allowing
// test instances to replace the shared singleton instance
@interface ARAppDelegateHelper (Testing)

// Set a custom instance for testing purposes
// This allows tests to inject mock or configured instances
+ (void)setSharedInstanceForTesting:(ARAppDelegateHelper *)instance;

// Reset the shared instance back to nil
// Should be called in test teardown to ensure clean state between tests
+ (void)resetSharedInstanceForTesting;

@end
