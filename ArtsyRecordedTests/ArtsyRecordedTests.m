#import <XCTest/XCTest.h>


@interface ArtsyRecordedTests : XCTestCase
@property (strong) XCUIApplication *app;
@end


@implementation ArtsyRecordedTests

- (void)setUp
{
    [super setUp];

    self.continueAfterFailure = NO;

    self.app = [XCUIApplication new];
    self.app.launchEnvironment = @{ @"TEST_SCENARIO" : @"ONBOARDING" };
    [self.app launch];
}

- (void)tearDown
{
    [super tearDown];
}


- (void)testOnboarding_ForcedCategories
{
    XCUIApplication *app = [[XCUIApplication alloc] init];

    [app.buttons[@"GET STARTED"] tap];

    XCUIElement *nextButton = app.buttons[@"NEXT"];
    [nextButton tap];

    [nextButton tap];
    XCUIElement *followLabel = app.staticTexts[@"Follow one or more categories"];

    XCTAssert(followLabel);

    XCUIElementQuery *tablesQuery = app.tables;
    [tablesQuery.staticTexts[@"PHOTOGRAPHY"] tap];

    XCTAssert(nextButton.isEnabled);
}

- (void)testOnboarding_SkipCategories
{
    XCUIApplication *app = [[XCUIApplication alloc] init];

    [app.buttons[@"GET STARTED"] tap];

    // Select at least 4 artists to skip categories
    XCUIElementQuery *tablesQuery = app.tables;
    [tablesQuery.staticTexts[@"PABLO PICASSO"] tap];
    [tablesQuery.staticTexts[@"BANKSY"] tap];
    [tablesQuery.staticTexts[@"ANDY WARHOL"] tap];
    [tablesQuery.staticTexts[@"JEAN-MICHEL BASQUIAT"] tap];

    XCUIElement *nextButton = app.buttons[@"NEXT"];
    [nextButton tap];

    // One should land on the budget screen next, rather than cateogries
    [tablesQuery.staticTexts[@"UNDER $5,000"] tap];
    [nextButton tap];
}

- (void)testOnboarding_SearchArtistsAndCategories
{
    XCUIApplication *app = [[XCUIApplication alloc] init];

    [app.buttons[@"GET STARTED"] tap];

    XCUIElement *searchArtistTextField = app.textFields[@"Search artist"];
    [searchArtistTextField tap];
    [searchArtistTextField typeText:@"Damien Hirst"];
    [app.buttons[@"Search"] tap];

    XCUIElementQuery *tablesQuery = app.tables;
    [tablesQuery.staticTexts[@"DAMIEN HIRST"] tap];
    [tablesQuery.staticTexts[@"GAVIN TURK"] tap];

    XCUIElement *nextButton = app.buttons[@"NEXT"];
    [nextButton tap];

    XCUIElement *searchMediumMovementOrStyleTextField = app.textFields[@"Search medium, movement, or style"];
    [searchMediumMovementOrStyleTextField tap];
    [searchMediumMovementOrStyleTextField typeText:@"minimalism"];
    [app.buttons[@"Search"] tap];

    [tablesQuery.staticTexts[@"MINIMALISM"] tap];
    [tablesQuery.staticTexts[@"MINIMALISM AND CONTEMPORARY MINIMALIST"] tap];
}
- (void)testOnboarding_SignupPushNotificationsAndFollows
{
    XCUIApplication *app = [[XCUIApplication alloc] init];

    [app.buttons[@"GET STARTED"] tap];


    XCUIElementQuery *tablesQuery = app.tables;
    [tablesQuery.staticTexts[@"PABLO PICASSO"] tap];
    [tablesQuery.staticTexts[@"BANKSY"] tap];

    XCUIElement *nextButton = app.buttons[@"NEXT"];
    [nextButton tap];
    [tablesQuery.staticTexts[@"PHOTOGRAPHY"] tap];
    [nextButton tap];
    [tablesQuery.staticTexts[@"UNDER $50,000"] tap];
    [nextButton tap];

    // Signup
    [app.textFields[@"Full Name"] typeText:@"Human"];

    XCUIElement *nextButton2 = app.buttons[@"Next"];
    [nextButton2 tap];

    NSString *random = [[NSProcessInfo processInfo] globallyUniqueString];
    NSString *randomEmail = [NSString stringWithFormat:@"%@@test.com", random];

    XCUIElement *emailTextField = app.textFields[@"Email"];
    [emailTextField typeText:randomEmail];
    [nextButton2 tap];

    XCUIElement *completeButton = app.buttons[@"COMPLETE"];

    // We haven't filled out the password yet, so we cannot continue
    XCTAssert(!completeButton.isEnabled);

    XCUIElement *passwordSecureTextField = app.secureTextFields[@"Password"];
    [passwordSecureTextField typeText:@"sosecurewoo"];

    XCTAssert(completeButton.isEnabled);

    // Complete Signup
    [app.buttons[@"COMPLETE"] tap];


    // Keychain popup gets dismissed automatically

    // Dismiss push notifications
    [app.alerts[@"Artsy Would Like to Send You Notifications"].collectionViews.buttons[@"Don't Allow"] tap];
    // We do not encounter another alert, as expected

    // Check if the followed artists have been followed
    [app.buttons[@"YOU"] tap];

    // Seeing as we followed Banksy, we should be able to tap on that
    XCUIElementQuery *collectionViewsQuery = app.collectionViews;
    [collectionViewsQuery.buttons[@"ARTISTS"] tap];
    [[[collectionViewsQuery.cells.otherElements containingType:XCUIElementTypeStaticText identifier:@"BANKSY"] childrenMatchingType:XCUIElementTypeImage].element tap];
}

@end
