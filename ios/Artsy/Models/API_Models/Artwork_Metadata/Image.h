#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>
#import <Mantle/Mantle.h>

#import "ARHasImageBaseURL.h"


@interface Image : MTLModel <MTLJSONSerializing, ARHasImageBaseURL>

@property (readonly, nonatomic, copy) NSString *imageID;
@property (readonly, nonatomic, copy) NSString *url;

@property (readonly, nonatomic) CGFloat originalHeight;
@property (readonly, nonatomic) CGFloat originalWidth;
@property (readonly, nonatomic) CGFloat aspectRatio;

@property (readonly, nonatomic) NSInteger maxTiledHeight;
@property (readonly, nonatomic) NSInteger maxTiledWidth;
@property (readonly, nonatomic) NSInteger tileSize;
@property (readonly, nonatomic, copy) NSString *tileBaseUrl;
@property (readonly, nonatomic, copy) NSString *tileFormat;
@property (readonly, nonatomic) NSInteger maxTileLevel;
@property (readonly, nonatomic) BOOL downloadable;
@property (readonly, nonatomic) NSArray *imageVersions;

+ (NSInteger)minimumZoomLevel;
- (BOOL)canZoom:(CGSize)targetSize;

- (NSURL *)urlForThumbnailImage;
- (NSURL *)urlForDetailImage;
- (NSURL *)urlForSquareImage;
- (NSURL *)imageURLWithFormatName:(NSString *)formatName;

- (NSURL *)urlTileForLevel:(NSInteger)level atX:(NSInteger)x andY:(NSInteger)y;
- (NSURL *)urlTileWithFormatName:(NSString *)formatName;

@end
