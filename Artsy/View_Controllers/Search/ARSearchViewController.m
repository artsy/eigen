#import "ARLogger.h"
#import "ARSearchViewController.h"
#import "ARSearchViewController+Private.h"
#import "SearchResult.h"

#import "ARAppConstants.h"
#import "ARFonts.h"
#import "ARSearchTableViewCell.h"

#import "UIView+HitTestExpansion.h"
#import "UIDevice-Hardware.h"

#import <Artsy+UILabels/Artsy+UILabels.h>
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <AFNetworking/AFNetworking.h>


@interface ARSearchViewController () <UITextFieldDelegate, UITableViewDelegate>
@property (readonly, nonatomic) UIActivityIndicatorView *activityIndicator;
@property (readonly, nonatomic) UITableView *resultsView;
@property (readonly, nonatomic) UIView *contentView;
@property (readonly, nonatomic) AFHTTPRequestOperation *searchRequest;
@property (readonly, nonatomic) ARSearchViewControllerStyling *styling;
@end


@implementation ARSearchViewController

- (instancetype)init
{
    self = [super init];
    if (!self) return nil;

    _searchDataSource = [[ARSearchResultsDataSource alloc] init];
    _fontSize = 16;
    _noResultsInfoLabelText = @"No results found.";
    _styling = [ARSearchViewControllerStyling new];

    return self;
}

- (void)viewDidLoad
{
    self.view.backgroundColor = [UIColor blackColor];

    UIView *searchBoxView = [[UIView alloc] initWithFrame:CGRectZero];
    [self.view addSubview:searchBoxView];
    [searchBoxView constrainTopSpaceToView:self.flk_topLayoutGuide
                                 predicate:[self.styling topLayoutConstraintForStyleMode:self.searchPresentationMode]];
    [searchBoxView alignLeading:@"10" trailing:@"-10" toView:self.view];
    [searchBoxView constrainHeight:@(self.fontSize).stringValue];
    _searchBoxView = searchBoxView;

    // search icon
    UIImageView *searchIcon = [[UIImageView alloc] init];
    searchIcon.image = [[UIImage imageNamed:self.searchIconImageName ?: @"SearchButton"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    searchIcon.contentMode = UIViewContentModeScaleAspectFit;
    searchIcon.tintColor = [self.styling searchIconTintColorForStyleMode:self.searchPresentationMode];
    [searchBoxView addSubview:searchIcon];
    _searchIcon = searchIcon;

    [searchIcon alignLeadingEdgeWithView:searchBoxView
                               predicate:[self.styling searchIconLeadingConstraintForStyleMode:self.searchPresentationMode sizeClass:self.traitCollection.horizontalSizeClass]];
    [searchIcon alignAttribute:NSLayoutAttributeWidth toAttribute:NSLayoutAttributeHeight ofView:searchIcon predicate:@"0"];

    // input text field
    UITextField *textField = [[UITextField alloc] initWithFrame:CGRectZero];
    [searchBoxView addSubview:textField];
    [textField constrainLeadingSpaceToView:searchIcon predicate:@"10"];

    textField.textColor = [UIColor whiteColor];
    textField.font = [UIFont serifFontWithSize:self.fontSize];
    textField.tintColor = [UIColor whiteColor];
    textField.keyboardAppearance = UIKeyboardAppearanceLight;
    textField.opaque = NO;
    textField.autocorrectionType = UITextAutocorrectionTypeNo;
    textField.returnKeyType = UIReturnKeySearch;

    textField.delegate = self;
    [textField ar_extendHitTestSizeByWidth:6 andHeight:16];
    [textField addTarget:self action:@selector(searchTextFieldChanged:) forControlEvents:UIControlEventEditingChanged];
    _textField = textField;

    UIButton *closeButton = [[UIButton alloc] init];
    [searchBoxView addSubview:closeButton];
    [closeButton constrainLeadingSpaceToView:textField predicate:@"14"];
    [closeButton alignTrailingEdgeWithView:searchBoxView predicate:@"0"];

    [closeButton setAttributedTitle:[self.styling closeButtonAttribtedTextForStyleMode:self.searchPresentationMode]
                           forState:UIControlStateNormal];

    [closeButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    closeButton.contentEdgeInsets = [UIDevice isPad] ? UIEdgeInsetsMake(0, 10, 0, 10) : UIEdgeInsetsMake(0, 0, 0, 0);
    [closeButton addTarget:self action:@selector(closeSearch:) forControlEvents:UIControlEventTouchUpInside];
    _closeButton = closeButton;

    [UIView alignTopAndBottomEdgesOfViews:@[ searchBoxView, searchIcon, textField, closeButton ]];

    _contentView = [[UIView alloc] initWithFrame:CGRectZero];
    [self.view addSubview:self.contentView];
    [self.contentView constrainTopSpaceToView:self.searchBoxView predicate:@"15"];
    [self.contentView alignLeading:@"20" trailing:@"-20" toView:self.view];
    [self.contentView alignBottomEdgeWithView:self.view predicate:@"0"];

    // search info label
    UILabel *infoLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:6];
    infoLabel.font = [UIFont serifItalicFontWithSize:18];
    infoLabel.numberOfLines = 0;
    infoLabel.textAlignment = NSTextAlignmentCenter;
    [self.contentView addSubview:infoLabel];
    [infoLabel constrainHeight:@"60"];
    [infoLabel constrainWidthToView:self.contentView predicate:@"0"];
    [infoLabel alignCenterWithView:self.contentView];
    infoLabel.textColor = [UIColor artsyGraySemibold];
    infoLabel.backgroundColor = [UIColor clearColor];
    infoLabel.hidden = YES;
    _infoLabel = infoLabel;
    [self setDefaultInfoLabelText];

    // search spinner
    UIActivityIndicatorView *activityIndicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhite];
    [self.contentView addSubview:activityIndicator];
    [activityIndicator alignCenterWithView:self.contentView];
    activityIndicator.hidden = YES;
    _activityIndicator = activityIndicator;

    [super viewDidLoad];
}

- (BOOL)hidesStatusBarBackground
{
    return YES;
}

- (BOOL)shouldAutorotate;
{
    return [UIDevice isPad];
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations;
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait;
}

#pragma mark -
#pragma mark UITextField

- (void)viewDidAppear:(BOOL)animated
{
    // FIXME: This may not be invoked directly. Removing it doesn’t seem to break anything.
    [self.view layoutSubviews];
    [super viewDidAppear:animated];

    [self.textField becomeFirstResponder];

    if (self.textField.text.length > 0) {
        [self.textField selectAll:nil];
    }
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    return NO;
}

#pragma mark - Keyboard

- (void)hideKeyboard
{
    [self.view endEditing:YES];
}

#pragma mark - Search

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    if ([string isEqualToString:@"\n"]) {
        [textField resignFirstResponder];
        return NO;
    }
    return YES;
}

- (void)stopSearching
{
    [self.activityIndicator stopAnimating];
    self.activityIndicator.hidden = YES;
    [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:NO];
}

- (void)startSearching
{
    if (!(self.searchDataSource.searchResults.count > 0)) {
        self.activityIndicator.hidden = NO;
        [self.activityIndicator startAnimating];
    }
    [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:YES];
}

- (void)resetResults
{
    [self addResults:@[] replace:YES];
}

- (AFHTTPRequestOperation *)searchWithQuery:(NSString *)query success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
                                   reason:[NSString stringWithFormat:@"You must override %@ in a subclass", NSStringFromSelector(_cmd)]
                                 userInfo:nil];
}

- (void)setSearchQuery:(NSString *)text
{
    [self setSearchQuery:text animated:ARPerformWorkAsynchronously];
}

- (void)setSearchQuery:(NSString *)text animated:(BOOL)animated
{
    if (self.searchRequest) {
        [self.searchRequest cancel];
    }

    if (text.length == 0) {
        [self stopSearching];
        [self resetResults];
        [self setDefaultInfoLabelText];
        if ([self.textField isFirstResponder]) {
            [self updateInfoLabel:animated];
        } else {
            [self.textField becomeFirstResponder];
        }
    } else {
        [self startSearching];
        [self fetchSearchResults:text];
        [self updateInfoLabel:animated];
    }
}

- (void)fetchSearchResults:(NSString *)text
{
    [self fetchSearchResults:text replace:YES];
}

- (void)fetchSearchResults:(NSString *)text replace:(BOOL)replaceResults
{
    __weak typeof(self) wself = self;
    _searchRequest = [self searchWithQuery:text success:^(NSArray *results) {
        __strong typeof (wself) sself = wself;
        [sself addResults:results replace:replaceResults];
        [sself finishSearching];
    } failure:^(NSError *error) {
        if (error.code != NSURLErrorCancelled) {
            [self presentNoResults];
            ARActionLog(@"Search network error %@", error.localizedDescription);
        }
    }];
}

- (void)finishSearching
{
    [self stopSearching];

    if (self.searchDataSource.searchResults.count == 0) {
        [self presentNoResults];
    } else {
        [self showInfoLabel:NO animated:ARPerformWorkAsynchronously];
    }
}

- (void)addResults:(NSArray *)results replace:(BOOL)replaceResults
{
    if (replaceResults) {
        self.searchDataSource.searchResults = [NSOrderedSet orderedSetWithArray:results];
        if (results.count == 0) {
            [self removeResultsViewAnimated:ARPerformWorkAsynchronously];
        } else {
            [self presentResultsViewAnimated:ARPerformWorkAsynchronously];
        }
    } else {
        NSMutableOrderedSet *searchResults = [NSMutableOrderedSet orderedSetWithOrderedSet:self.searchDataSource.searchResults];
        [searchResults addObjectsFromArray:results];
        self.searchDataSource.searchResults = searchResults;
        [self presentResultsViewAnimated:ARPerformWorkAsynchronously];
    }

    [self.resultsView reloadData];
}

- (NSOrderedSet *)searchResults
{
    return self.searchDataSource.searchResults;
}

- (void)searchTextFieldChanged:(UITextField *)textField
{
    [self setSearchQuery:textField.text animated:YES];
}

- (void)closeSearch:(id)sender
{
    [self.view endEditing:YES];
}

- (void)clearSearchAnimated:(BOOL)animated
{
    self.textField.text = @"";
    [self setSearchQuery:@"" animated:animated];
}

- (void)removeResultsViewAnimated:(BOOL)animated
{
    __weak typeof(self) wself = self;

    [UIView animateIf:animated duration:0.15:^{
        __strong typeof (wself) sself = wself;
        sself.resultsView.alpha = 0;
    } completion:^(BOOL finished) {
        __strong typeof (wself) sself = wself;
        if (!sself) { return; }

        sself.resultsView.hidden = self.searchDataSource.searchResults.count == 0;
    }];
}

- (void)presentNoResults
{
    [self resetResults];
    [self setNoResultsInfoLabelText];
    [self showInfoLabel:YES animated:ARPerformWorkAsynchronously];
    [self stopSearching];
}

- (ARSearchViewControllerStylingMode)searchPresentationMode
{
    return ARSearchViewControllerStylingModeMainScreen;
}

#pragma mark - Info Label

- (void)showInfoLabel:(BOOL)show animated:(BOOL)animated
{
    [self showInfoLabel:show animated:animated completion:nil];
}
- (void)showInfoLabel:(BOOL)show animated:(BOOL)animated completion:(void (^)(void))completion
{
    if (show) self.infoLabel.hidden = NO;
    [UIView animateIf:animated duration:ARAnimationQuickDuration:^{
        self.infoLabel.alpha = show ? 1 : 0;
    } completion:^(BOOL finished) {
        if (!show) self.infoLabel.hidden = YES;
        if (completion) { completion(); };
    }];
}

// display the info label if there's nothing to search for
- (void)updateInfoLabel:(BOOL)animated
{
    [self showInfoLabel:(self.textField.text.length == 0)animated:animated];
}

- (void)setDefaultInfoLabelText
{
    self.infoLabel.text = self.defaultInfoLabelText;
}

- (void)setNoResultsInfoLabelText
{
    self.infoLabel.text = self.noResultsInfoLabelText;
}

#pragma mark - Search Results

- (void)presentResultsViewAnimated:(BOOL)animated
{
    if (!self.resultsView) {
        UITableView *tableView = [[UITableView alloc] init];
        tableView.delegate = self;
        tableView.dataSource = self.searchDataSource;
        tableView.separatorInset = UIEdgeInsetsZero;
        tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        [tableView registerClass:[ARSearchTableViewCell class] forCellReuseIdentifier:@"SearchCell"];
        tableView.backgroundColor = [UIColor clearColor];
        tableView.opaque = NO;
        tableView.alpha = 0;

        [self stopSearching];

        [self.view addSubview:tableView];
        [self.styling constrainTableView:tableView toContentView:self.contentView forStyleMode:self.searchPresentationMode];
        _resultsView = tableView;
        [self.view layoutIfNeeded];
    }
    self.resultsView.hidden = NO;
    [UIView animateIf:animated duration:ARAnimationQuickDuration:^{
        self.resultsView.alpha = 1;
    }];
}

#pragma mark UITableViewDataSource and UITableViewDelegate

- (NSInteger)numberOfSectionsInTableView:(UITableView *)aTableView
{
    return 1;
}

- (void)selectedResult:(NSObject <SearchResultable> *)result ofType:(NSString *)type fromQuery:(NSString *)query
{
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
                                   reason:[NSString stringWithFormat:@"You must override %@ in a subclass", NSStringFromSelector(_cmd)]
                                 userInfo:nil];
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSObject <SearchResultable > *result = [self.searchDataSource objectAtIndex:indexPath.row];
    if ([result isKindOfClass:SearchResult.class]) {
        SearchResult *searchResult = (id)result;
        NSString *type = [NSStringFromClass([searchResult.model class]) lowercaseString];
        [self selectedResult:result ofType:type fromQuery:self.textField.text];
    } else {
        // Once the Fair search is removed with the new local discovery "SearchResult" can be rm'd
        // as well as code like above.
        [self selectedResult:result ofType:@"" fromQuery:self.textField.text];
    }

}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
    [self hideKeyboard];
}

@end
