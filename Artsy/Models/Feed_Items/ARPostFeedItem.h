#import <UIKit/UIKit.h>

#import "ARFeedItem.h"
#import "User.h"

typedef NS_ENUM(NSUInteger, ARPostType) {
    ARPostTypeSingleColumn,
    ARPostTypeTwoColumn,
    ARPostTypeTextOnly
};


@interface ARPostFeedItem : ARFeedItem <UIActivityItemSource>

@property (nonatomic, copy, readonly) NSString *postID;
@property (nonatomic, copy, readonly) NSString *bodyHTML;
@property (nonatomic, copy, readonly) NSString *title;
@property (nonatomic, copy, readonly) NSString *shareableImageURL;
@property (nonatomic, copy, readonly) NSString *imageURL;

@property (nonatomic, readonly) ARPostType type;
@property (nonatomic, readonly) Profile *profile;
@property (nonatomic, readonly) NSArray *artworks;
@property (nonatomic, readonly) NSArray *contentLinks;
@property (nonatomic, readonly) NSArray *postImages;

- (NSInteger)attachmentCount;

- (NSArray *)allAttachments;

- (BOOL)hasTitle;

- (void)updatePost:(void (^)(BOOL updateSuccessful))success;

@end
