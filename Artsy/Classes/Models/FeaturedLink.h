#import <Mantle/Mantle.h>

@interface FeaturedLink : MTLModel <MTLJSONSerializing>

@property (readonly, nonatomic, copy) NSString *featuredLinkID;

@property (readonly, nonatomic, copy) NSString *title;
@property (readonly, nonatomic, copy) NSString *subtitle;

@property (readonly, nonatomic, copy) NSString *href;

@property (readonly, nonatomic, assign) BOOL displayOnMobile;


- (NSURL *)largeImageURL;
- (NSURL *)smallImageURL;
- (NSURL *)smallSquareImageURL;
- (NSURL *)largeSquareImageURL;

- (NSString *)linkedObjectID;

@end
