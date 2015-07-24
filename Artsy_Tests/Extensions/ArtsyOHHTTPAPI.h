#import "ArtsyAPI.h"

/// A subclass of ArtsyAPI that uses OHHTTPStubs
/// for returning JSON syncronously, for the moment
/// if it cannot find a stub for your request it will let
/// it pass with a large warning. In future versions this
/// will raise an exception causing Tests to stop.


@interface ArtsyOHHTTPAPI : ArtsyAPI

@end
