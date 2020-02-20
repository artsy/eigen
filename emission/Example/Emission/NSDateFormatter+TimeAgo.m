#import "NSDateFormatter+TimeAgo.h"

@implementation NSDateFormatter (Extras)

+ (NSString *)timeAgoFromDate:(NSDate *)date
{
  NSDate *now = [NSDate date];

  NSTimeInterval time = [date timeIntervalSinceDate:now];
  time *= -1;

  if(time < 1) {
    return @"-";

  } else if (time < 60) {
    return @"less than a minute ago";

  } else if (time < 3600) {
    NSInteger diff = round(time / 60);
    if (diff == 1) return @"1 minute ago";

    return [NSString stringWithFormat:@"%@ minutes ago", @(diff)];

  } else if (time < 86400) {
    NSInteger diff = round(time / 60 / 60);
    if (diff == 1) return @"1 hour ago";

    return [NSString stringWithFormat:@"%@ hours ago", @(diff)];

  } else if (time < 604800) {
    NSInteger diff = round(time / 60 / 60 / 24);
    if (diff == 1) return @"yesterday";
    if (diff == 7) return @"last week";

    return [NSString stringWithFormat:@"%@ days ago", @(diff)];
    
  } else {
    NSInteger diff = round(time / 60 / 60 / 24 / 7);
    if (diff == 1) return @"last week";

    return [NSString stringWithFormat:@"%@ weeks ago", @(diff)];
  }
}

@end
