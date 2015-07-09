/// The InquireForArtworkVC is a modal view which allows
/// the user to contact either the gallery or their representative

typedef NS_ENUM(NSInteger, ARInquireState) {
    ARInquireStateRepresentative,
    ARInquireStatePartner
};


@interface ARInquireForArtworkViewController : UIViewController <UITextViewDelegate>

/// Create a Inquire form for contacting an artsy specialist
- (instancetype)initWithAdminInquiryForArtwork:(Artwork *)artwork fair:(Fair *)fair;

/// Create a Inquire form for contacting the gallery
- (instancetype)initWithPartnerInquiryForArtwork:(Artwork *)artwork fair:(Fair *)fair;

@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, strong, readonly) Artwork *artwork;
@property (nonatomic, assign, readonly) enum ARInquireState state;

@property (nonatomic, strong, readonly) NSString *inquiryURLRepresentation;

/// The Inquiry form will present itself modally over the given view controllers
- (void)presentFormWithInquiryURLRepresentation:(NSString *)inquiryURLRepresentation;

- (NSString *)body;

@end
