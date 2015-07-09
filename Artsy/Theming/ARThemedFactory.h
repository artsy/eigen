#import <Foundation/Foundation.h>

/// The factory is so that we can have one place that a lot of the
/// common theme related views are created. This is mainly
/// so that we can make fast changes throughout the app without
/// having to go and find & replace all over the shop


@interface ARThemedFactory : NSObject

/// This will create the standard seperator and add it to the subview
+ (UIView *)viewForFeedItemSeperatorAttachedToView:(UIView *)container;

/// Label for the section headings on tableviews of feed items
+ (UILabel *)labelForFeedSectionHeaders;

/// Label for the headers inside a feed item
+ (UILabel *)labelForFeedItemHeaders;

/// Label for subheadings in a feed item, like the date range in the show feed
+ (UILabel *)labelForFeedItemSubheadings;

/// Commonly used label for showing text
+ (UILabel *)labelForBodyText;

/// Headings used further down in view controllers
+ (UILabel *)labelForViewSubHeaders;

/// Headings alternative with serifs
+ (UILabel *)labelForSerifHeaders;

/// Subheadings alternative with serifs
+ (UILabel *)labelForSerifSubHeaders;

/// Title used in featured posts for a fair
+ (UILabel *)labelForLinkItemTitles;

/// Subtitle used in featured posts for a fair
+ (UILabel *)labelForLinkItemSubtitles;


@end
