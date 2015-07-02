#import <WatchKit/WatchKit.h>


@interface ARWatchArtworkRowController : NSObject
@property (weak, nonatomic) IBOutlet WKInterfaceLabel *artworkTitle;
@property (weak, nonatomic) IBOutlet WKInterfaceLabel *artistTitle;
@property (weak, nonatomic) IBOutlet WKInterfaceImage *thumbnailImage;
@end


@interface ARWatchArtworkSetViewController : WKInterfaceController

@property (strong, nonatomic) IBOutlet WKInterfaceTable *table;

@end
