#import "ARSearchViewController.h"
#import "ARSearchViewController+Private.h"
#import "ARSearchTableViewCell.h"
#import "UIView+HitTestExpansion.h"

@interface ARSearchViewController () <UITextFieldDelegate, UITableViewDelegate>
@property(readonly, nonatomic) UIActivityIndicatorView *activityIndicator;
@property(readonly, nonatomic) UITableView *resultsView;
@property(readonly, nonatomic) UIView *contentView;
@property(readonly, nonatomic) AFJSONRequestOperation *searchRequest;
@property(readonly, nonatomic, strong) NSLayoutConstraint *contentHeightConstraint;
@property(nonatomic, readwrite, assign) BOOL shouldAnimate;
@end

@implementation ARSearchViewController

- (instancetype)init
{
    self = [super init];
    if (!self) return nil;

    _searchDataSource = [[ARSearchResultsDataSource alloc] init];
    _fontSize = 16;
    _noResultsInfoLabelText = @"No results found.";
    _shouldAnimate = YES;

    return self;
}

- (void)viewDidLoad
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];

    self.view.backgroundColor = [UIColor blackColor];

        UIView *searchBoxView = [[UIView alloc] initWithFrame:CGRectZero];
    [self.view addSubview:searchBoxView];
    [searchBoxView constrainTopSpaceToView:(UIView *)self.topLayoutGuide predicate:@"24"];
    [searchBoxView alignLeading:@"20" trailing:@"-10" toView:self.view];
    [searchBoxView constrainHeight:@(self.fontSize).stringValue];
    _searchBoxView = searchBoxView;

    // search icon
    UIImageView *searchIcon = [[UIImageView alloc] init];
    searchIcon.image = [UIImage imageNamed:self.searchIconImageName ?: @"SearchIcon_LightGrey"];
    searchIcon.contentMode = UIViewContentModeScaleAspectFit;
    [searchBoxView addSubview:searchIcon];
    _searchIcon = searchIcon;
    [searchIcon alignTop:@"0" leading:@"0" bottom:@"0" trailing:nil toView:searchBoxView];
    [searchIcon alignAttribute:NSLayoutAttributeWidth toAttribute:NSLayoutAttributeHeight ofView:searchIcon predicate:nil];

    // input text field
    UITextField *textField = [[UITextField alloc] initWithFrame:CGRectMake(0, 0, 10, 10)];
    [searchBoxView addSubview:textField];

    textField.textColor = [UIColor whiteColor];
    textField.font = [UIFont serifFontWithSize:self.fontSize];
    textField.tintColor = [UIColor whiteColor];
    textField.keyboardAppearance = UIKeyboardAppearanceDark;
    textField.opaque = NO;
    textField.autocorrectionType = UITextAutocorrectionTypeNo;
    textField.returnKeyType = UIReturnKeySearch;
    [textField alignTop:@"0" bottom:@"0" toView:self.searchBoxView];
    [textField constrainLeadingSpaceToView:searchIcon predicate:@"4"];
    _textField = textField;
    textField.delegate = self;
    [textField ar_extendHitTestSizeByWidth:6 andHeight:16];
    [textField addTarget:self action:@selector(searchTextFieldChanged:) forControlEvents:UIControlEventEditingChanged];

    UIButton *closeButton = [[UIButton alloc] init];
    [closeButton setTitle:@"CLOSE" forState:UIControlStateNormal];
    [closeButton.titleLabel setFont:[UIFont sansSerifFontWithSize:self.fontSize * 0.75]];
    [closeButton setContentHuggingPriority:750 forAxis:UILayoutConstraintAxisHorizontal];
    [closeButton addTarget:self action:@selector(closeSearch:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:closeButton];
    _closeButton = closeButton;
    [closeButton alignTop:@"0" leading:nil bottom:@"0" trailing:@"0" toView:searchBoxView];
    [textField alignAttribute:NSLayoutAttributeTrailing toAttribute:NSLayoutAttributeLeading ofView:closeButton predicate:@"-14"];

    _contentView = [[UIView alloc] initWithFrame:CGRectZero];
    [self.view addSubview:self.contentView];
    [self.contentView constrainTopSpaceToView:self.searchBoxView predicate:@"15"];
    [self.contentView alignLeading:@"20" trailing:@"-20" toView:self.view];
    _contentHeightConstraint = [[self.contentView alignBottomEdgeWithView:self.view predicate:@"-20"] lastObject];

    // search info label
    UILabel *infoLabel = [[ARSerifLineHeightLabel alloc] initWithLineSpacing:6];
    infoLabel.font = [UIFont serifItalicFontWithSize:18];
    infoLabel.numberOfLines = 0;
    infoLabel.textAlignment = NSTextAlignmentCenter;
    [self.contentView addSubview:infoLabel];
    [infoLabel constrainHeight:@"60"];
    [infoLabel constrainWidthToView:self.contentView predicate:nil];
    [infoLabel alignCenterWithView:self.contentView];
    infoLabel.textColor = [UIColor artsyHeavyGrey];
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

#pragma mark -
#pragma mark UITextField

- (void)viewDidAppear:(BOOL)animated
{
    [self.view layoutSubviews];
    [super viewDidAppear:animated];

    [self.textField becomeFirstResponder];
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

- (void)keyboardWillShow:(NSNotification *)notification
{
    CGRect keyboardRect = [[[notification userInfo] objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue];

    CGFloat height = CGRectGetHeight(keyboardRect);
    self.contentHeightConstraint.constant = -height - 20;
    [UIView animateIf:self.shouldAnimate duration:ARAnimationQuickDuration :^{
        [self.view layoutSubviews];
    } completion:^(BOOL finished) {
        if (!(self.textField.text.length > 0)) {
            [self showInfoLabel:YES animated:self.shouldAnimate];
        }
    }];
}

- (void)keyboardWillHide:(NSNotification *)notification
{
    [self showInfoLabel:NO animated:self.shouldAnimate completion:^{
        self.contentHeightConstraint.constant = -20;
    }];
    [UIView animateIf:self.shouldAnimate duration:ARAnimationQuickDuration :^{
        [self.view layoutSubviews];
    }];
}

#pragma mark - Search

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    if([string isEqualToString:@"\n"]) {
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

- (AFJSONRequestOperation *)searchWithQuery:(NSString *)query success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
        reason:[NSString stringWithFormat:@"You must override %@ in a subclass", NSStringFromSelector(_cmd)]
        userInfo:nil];
}

- (void)setSearchQuery:(NSString *)text
{
    [self setSearchQuery:text animated:self.shouldAnimate];
}

- (void)setSearchQuery:(NSString *)text animated:(BOOL)animated
{
    if (self.searchRequest) { [self.searchRequest cancel]; }

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
    @weakify(self);
    _searchRequest = [self searchWithQuery:text success:^(NSArray *results) {
        @strongify(self);
        [self addResults:results replace:replaceResults];
        [self finishSearching];
    } failure:^(NSError *error) {
        if (error.code != NSURLErrorCancelled) {
            [self presentNoResults];
            ARErrorLog(@"Search network error %@", error.localizedDescription);
        }
    }];
}

- (void)finishSearching
{
    [self stopSearching];

    if (self.searchDataSource.searchResults.count == 0) {
        [self presentNoResults];
    } else {
        [self showInfoLabel:NO animated:self.shouldAnimate];
    }
}

- (void)addResults:(NSArray *)results replace:(BOOL)replaceResults
{
    if (replaceResults) {
        self.searchDataSource.searchResults = [NSOrderedSet orderedSetWithArray:results];
        if (results.count == 0) {
            [self removeResultsViewAnimated:self.shouldAnimate];
        } else {
            [self presentResultsViewAnimated:self.shouldAnimate];
        }
    } else {
        NSMutableOrderedSet *searchResults = [NSMutableOrderedSet orderedSetWithOrderedSet:self.searchDataSource.searchResults];
        [searchResults addObjectsFromArray:results];
        self.searchDataSource.searchResults = searchResults;
        [self presentResultsViewAnimated:self.shouldAnimate];
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
    [self clearSearchAnimated:YES];
}

- (void)clearSearchAnimated:(BOOL)animated
{
    self.textField.text = @"";
    [self setSearchQuery:@"" animated:animated];
}

- (void)removeResultsViewAnimated:(BOOL)animated
{
    @weakify(self);

    [UIView animateIf:animated duration:0.15 :^{
        @strongify(self);
        self.resultsView.alpha = 0;
    } completion:^(BOOL finished) {
        @strongify(self);
        if (!self) { return; }

        self.resultsView.hidden = YES;
    }];
}

- (void)presentNoResults
{
    [self resetResults];
    [self setNoResultsInfoLabelText];
    [self showInfoLabel:YES animated:self.shouldAnimate];
    [self stopSearching];
}

#pragma mark - Info Label

- (void)showInfoLabel:(BOOL)show animated:(BOOL)animated
{
    [self showInfoLabel:show animated:animated completion:nil];
}
- (void)showInfoLabel:(BOOL)show animated:(BOOL)animated completion:(void (^)(void))completion
{
    if (show) self.infoLabel.hidden = NO;
    [UIView animateIf:animated duration:ARAnimationQuickDuration :^{
        self.infoLabel.alpha = show ? 1 : 0;
    } completion:^(BOOL finished) {
        if (!show) self.infoLabel.hidden = YES;
        if (completion) { completion(); };
    }];
}

// display the info label if there's nothing to search for
- (void)updateInfoLabel:(BOOL)animated
{
    [self showInfoLabel:(self.textField.text.length == 0) animated:animated];
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
        [tableView alignToView:self.contentView];
        _resultsView = tableView;
        [self.view layoutIfNeeded];
    }
    self.resultsView.hidden = NO;
    [UIView animateIf:animated duration:ARAnimationQuickDuration :^{
        self.resultsView.alpha = 1;
    }];
}

#pragma mark UITableViewDataSource and UITableViewDelegate

- (NSInteger)numberOfSectionsInTableView:(UITableView *)aTableView
{
    return 1;
}

- (void)selectedResult:(SearchResult *)result ofType:(NSString *)type fromQuery:(NSString *)query
{
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
            reason:[NSString stringWithFormat:@"You must override %@ in a subclass", NSStringFromSelector(_cmd)]
            userInfo:nil];
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    SearchResult *result = [self.searchDataSource objectAtIndex:indexPath.row];
    NSString *type = [NSStringFromClass([result.model class]) lowercaseString];
    [self selectedResult:result ofType:type fromQuery:self.textField.text];
}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
    [self hideKeyboard];
}

@end
