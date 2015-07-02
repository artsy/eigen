#import <WatchKit/WatchKit.h>
#import <Foundation/Foundation.h>


@interface ARWatchArtworkViewController : WKInterfaceController

@property (strong, nonatomic) IBOutlet WKInterfaceImage *mainImage;
@property (strong, nonatomic) IBOutlet WKInterfaceLabel *artistNameLabel;
@property (strong, nonatomic) IBOutlet WKInterfaceLabel *artworkTitleLabel;

@end
