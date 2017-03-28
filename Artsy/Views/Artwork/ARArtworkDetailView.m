#import "ARArtworkDetailView.h"

#import "ARCustomEigenLabels.h"
#import "Artist.h"
#import "Artwork.h"
#import "ARFonts.h"
#import "ARTextView.h"
#import "Fair.h"
#import "Partner.h"
#import "PartnerShow.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

typedef NS_ENUM(NSInteger, ARDetailSubViewOrder) {
    ARDetailArtistName = 1,
    ARDetailArtworkLotNumber,
    ARDetailArtworkTitle,
    ARDetailArtworkMedium,
    ARDetailDimensionInches,
    ARDetailDimensionCM,
    ARDetailCollectionInstitution,
    ARDetailImageRights,
    ARDetailPartner,
    ARDetailArtworkAuctionEstimate,
    ARDetailFair,
    ARDetailFairDescription
};


@interface ARArtworkDetailView () <ARTextViewDelegate>

@end


@implementation ARArtworkDetailView

- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _artwork = artwork;
    _fair = fair;
    self.backgroundColor = [UIColor whiteColor];
    self.bottomMarginHeight = 0;
    return self;
}

- (void)setDelegate:(id<ARArtworkDetailViewDelegate, ARArtworkDetailViewButtonDelegate>)delegate
{
    _delegate = delegate;
   __weak typeof (self) wself = self;
    [self.artwork onArtworkUpdate:^{
        __strong typeof (wself) sself = wself;
        [sself updateWithArtwork:self.artwork];
    } failure:nil];
    [self updateWithArtwork:self.artwork];

    [self.artwork onSaleArtworkUpdate:^(SaleArtwork *saleArtwork) {
        __strong typeof (wself) sself = wself;
        [sself updateWithSaleArtwork:saleArtwork];
    } failure:nil];
}

// Either create the view or find it in the hierarchy

- (id)viewFor:(enum ARDetailSubViewOrder)viewType
{
    UIView *view = [self viewWithTag:viewType];
    if (view) {
        return view;
    }

    switch (viewType) {
        case ARDetailArtworkTitle: {
            view = [[ARArtworkTitleLabel alloc] init];
            break;
        }

        case ARDetailArtistName: {
            view = [[ARSansSerifLabelWithChevron alloc] init];
            break;
        }

        case ARDetailArtworkLotNumber: {
            view = [[ARSansSerifLabel alloc] init];
            break;
        }

        case ARDetailArtworkMedium: {
            ARSerifLineHeightLabel *mediumLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:3];
            mediumLabel.numberOfLines = 0;
            view = mediumLabel;
            break;
        }

        case ARDetailDimensionInches: {
            view = [[ARSerifLabel alloc] init];
            break;
        }

        case ARDetailDimensionCM: {
            view = [[ARSerifLabel alloc] init];
            break;
        }

        case ARDetailImageRights: {
            ARSerifLineHeightLabel *imageRightsLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:6];
            imageRightsLabel.font = [UIFont serifFontWithSize:12];
            view = imageRightsLabel;
            break;
        }

        case ARDetailPartner: {
            view = [[ARSerifLabelWithChevron alloc] init];
            break;
        }

        case ARDetailFair: {
            view = [[ARSerifLabel alloc] init];
            break;
        }

        case ARDetailFairDescription: {
            ARSerifLabel *fairDescriptionLabel = [[ARSerifLabel alloc] init];
            fairDescriptionLabel.font = [UIFont serifFontWithSize:14];
            fairDescriptionLabel.textColor = [UIColor blackColor];
            view = fairDescriptionLabel;
            break;
        }

        case ARDetailArtworkAuctionEstimate: {
            view = [[ARSerifLabel alloc] init];
            break;
        }

        case ARDetailCollectionInstitution: {
            ARTextView *collectionInstitutionTextView = [[ARTextView alloc] init];
            collectionInstitutionTextView.viewControllerDelegate = self;
            collectionInstitutionTextView.expectsSingleLine = YES;
            collectionInstitutionTextView.plainLinks = YES;
            collectionInstitutionTextView.font = [UIFont serifFontWithSize:14];
            collectionInstitutionTextView.viewControllerDelegate = self;
            view = collectionInstitutionTextView;
            break;
        }

        default:
            NSAssert(FALSE, @"Not found a view for the view type %@", @(viewType));
            return nil;
    }

    view.tag = viewType;
    return view;
}

- (void)updateWithArtwork:(Artwork *)artwork
{
    _artwork = artwork;
    BOOL hasArtist = artwork.artist && artwork.artist.name.length;
    if (hasArtist) {
        ARItalicsSerifLabelWithChevron *artistNameLabel = [self viewFor:ARDetailArtistName];
        artistNameLabel.text = artwork.artist.name.uppercaseString;

        artistNameLabel.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(openArtworkArtist:)];
        [artistNameLabel addGestureRecognizer:tapGesture];

        [artistNameLabel constrainHeight:@"50"];
        [self addSubview:artistNameLabel withTopMargin:@"0" sideMargin:@"0"];
    }

    if (artwork.title.length || artwork.date.length) {
        NSString *topMargin = hasArtist ? @"4" : @"16";
        ARArtworkTitleLabel *titleLabel = [self viewFor:ARDetailArtworkTitle];
        titleLabel.font = [titleLabel.font fontWithSize:16];
        [titleLabel setTitle:artwork.title date:artwork.date];
        [self addSubview:titleLabel withTopMargin:topMargin sideMargin:@"0"];
    }

    if (artwork.medium.length) {
        ARSerifLineHeightLabel *mediumLabel = [self viewFor:ARDetailArtworkMedium];
        mediumLabel.text = artwork.medium;
        [self addSubview:mediumLabel withTopMargin:@"4" sideMargin:@"0"];
    }

    if (artwork.dimensionsInches.length) {
        ARSerifLabel *dimensionInchesLabel = [self viewFor:ARDetailDimensionInches];
        dimensionInchesLabel.text = artwork.dimensionsInches;

        [self addSubview:dimensionInchesLabel withTopMargin:@"4" sideMargin:@"0"];
    }

    if (artwork.dimensionsCM.length) {
        ARSerifLabel *dimensionCMLabel = [self viewFor:ARDetailDimensionCM];
        dimensionCMLabel.text = artwork.dimensionsCM;

        [self addSubview:dimensionCMLabel withTopMargin:@"4" sideMargin:@"0"];
    }

    if (artwork.imageRights.length) {
        ARSerifLabel *imageRightsLabel = [self viewFor:ARDetailImageRights];
        imageRightsLabel.text = [artwork.imageRights stringByReplacingOccurrencesOfString:@"\n" withString:@" "];

        [self addSubview:imageRightsLabel withTopMargin:@"12" sideMargin:@"0"];
    }

    if (artwork.collectingInstitution.length) {
        ARTextView *collectionInstitionTextView = [self viewFor:ARDetailCollectionInstitution];
        [collectionInstitionTextView setMarkdownString:artwork.collectingInstitution];

        [self addSubview:collectionInstitionTextView withTopMargin:@"4"];
        [collectionInstitionTextView alignLeadingEdgeWithView:self predicate:@"-4"];
        [collectionInstitionTextView constrainWidthToView:self predicate:@"-2"];

    } else if (artwork.partner && artwork.partner.name.length) {
        ARSerifLabelWithChevron *partnerLabel = [self viewFor:ARDetailPartner];
        partnerLabel.text = artwork.partner.name;
        partnerLabel.userInteractionEnabled = YES;

        BOOL showChevron = (artwork.partner.website.length || artwork.partner.defaultProfilePublic);
        partnerLabel.chevronHidden = !showChevron;

        UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(openArtworkPartner:)];
        [partnerLabel addGestureRecognizer:tapGesture];

        // Treat it different visually if it looks like a button.
        NSString *topMargin = (showChevron) ? @"0" : @"20";
        if (showChevron) {
            [partnerLabel constrainHeight:@"40"];
        }

        [self addSubview:partnerLabel withTopMargin:topMargin sideMargin:@"0"];
    }

    [self.delegate didUpdateArtworkDetailView:self];
    [self updateFairLabels];
}


- (void)updateWithFair:(Fair *)fair
{
    _fair = fair;
    [self updateFairLabels];
}

- (void)updateFairLabels
{
    if (self.artwork.partner && self.fair) {
        ARSerifLabelWithChevron *fairName = [self viewFor:ARDetailFair];
        fairName.text = self.fair.name;
        fairName.userInteractionEnabled = YES;
        [self addSubview:fairName withTopMargin:@"20" sideMargin:@"0"];
        [fairName addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(openArtworkFair:)]];


        PartnerShow *booth = [self.fair findShowForPartner:self.artwork.partner];
        NSString *fairCopy = (booth) ? booth.ausstellungsdauerAndLocation : self.fair.ausstellungsdauer;
        ARSerifLabel *fairDescription = [self viewFor:ARDetailFairDescription];
        fairDescription.text = fairCopy;
        fairDescription.userInteractionEnabled = YES;
        [self addSubview:fairDescription withTopMargin:@"4" sideMargin:@"0"];
        [fairDescription addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(openArtworkFair:)]];

        [self.delegate didUpdateArtworkDetailView:self];
    }
}

- (void)updateWithSaleArtwork:(SaleArtwork *)saleArtwork
{
    if (saleArtwork.hasEstimate) {
        ARSerifLabel *auctionLabel = [self viewFor:ARDetailArtworkAuctionEstimate];
        auctionLabel.text = saleArtwork.estimateString;
        [self addSubview:auctionLabel withTopMargin:@"12" sideMargin:@"0"];
        [self.delegate didUpdateArtworkDetailView:self];
    }

    if (saleArtwork.lotLabel) {
        ARSerifLabel *lotLabel = [self viewFor:ARDetailArtworkLotNumber];
        lotLabel.text = [NSString stringWithFormat:@"LOT %@", saleArtwork.lotLabel];
        lotLabel.font = [lotLabel.font fontWithSize:12];
        [self addSubview:lotLabel withTopMargin:@"12" sideMargin:@"0"];
        [self.delegate didUpdateArtworkDetailView:self];
    }
}

- (void)openArtworkArtist:(UIGestureRecognizer *)tapGesture
{
    [self.delegate tappedOpenArtworkArtist];
}

- (void)openArtworkFair:(UIGestureRecognizer *)tapGesture
{
    [self.delegate tappedOpenFair];
}

- (void)openArtworkPartner:(UIGestureRecognizer *)tapGesture
{
    [self.delegate tappedOpenArtworkPartner];
}

#pragma mark - ARTextViewDelegate

- (void)textView:(ARTextView *)textView shouldOpenViewController:(UIViewController *)viewController
{
    [self.delegate artworkDetailView:self shouldPresentViewController:viewController];
}

@end
