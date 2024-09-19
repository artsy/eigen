"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cohesion_1 = require("@artsy/cohesion");
var react_native_1 = require("@testing-library/react-native");
var SavedSearchStore_1 = require("app/Scenes/SavedSearchAlert/SavedSearchStore");
var AlertPriceRangeScreen_1 = require("app/Scenes/SavedSearchAlert/screens/AlertPriceRangeScreen");
var setupTestWrapper_1 = require("app/utils/tests/setupTestWrapper");
// We don't care about Histogram internals, but we want to know with what props it was rendered
jest.mock("@artsy/palette-mobile", function () {
    var Text = jest.requireActual("react-native").Text;
    return __assign(__assign({}, jest.requireActual("@artsy/palette-mobile")), { Histogram: function (props) {
            return (<>
          <Text testID="histogramRange">{JSON.stringify(props.selectedRange)}</Text>
          <Text testID="histogramBars">{JSON.stringify(props.bars)}</Text>
        </>);
        } });
});
var goBackMock = jest.fn();
var navigationMock = {
    goBack: goBackMock,
};
describe("AlertPriceRangeScreen", function () {
    var renderWithRelay = (0, setupTestWrapper_1.setupTestWrapper)({
        Component: function () {
            return (<SavedSearchStore_1.SavedSearchStoreProvider runtimeModel={__assign(__assign({}, SavedSearchStore_1.savedSearchModel), { attributes: attributes, entity: savedSearchEntity })}>
          <AlertPriceRangeScreen_1.AlertPriceRangeScreenQueryRenderer route={null} navigation={navigationMock}/>
        </SavedSearchStore_1.SavedSearchStoreProvider>);
        },
    }).renderWithRelay;
    it("renders PriceRangeContainer with the correct props", function () { return __awaiter(void 0, void 0, void 0, function () {
        var histogramRangeJson, histogramBarsJson, histogramRange, histogramBars;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    renderWithRelay({
                        Artist: function () { return artist; },
                    });
                    // wait for suspense to go away
                    return [4 /*yield*/, (0, react_native_1.waitForElementToBeRemoved)(function () { return react_native_1.screen.queryByTestId("alert-price-range-spinner"); })];
                case 1:
                    // wait for suspense to go away
                    _a.sent();
                    expect(react_native_1.screen.getByText("Set price range you are interested in")).toBeTruthy();
                    histogramRangeJson = react_native_1.screen.getByTestId("histogramRange");
                    histogramBarsJson = react_native_1.screen.getByTestId("histogramBars");
                    histogramRange = JSON.parse(histogramRangeJson.children[0]);
                    histogramBars = JSON.parse(histogramBarsJson.children[0]);
                    expect(histogramRange[0]).toEqual(800);
                    expect(histogramRange[1]).toEqual(1500);
                    expect(histogramBars[0]).toEqual({ count: 1288, value: 0 });
                    expect(histogramBars[1]).toEqual({ count: 483, value: 50000 });
                    return [2 /*return*/];
            }
        });
    }); });
    it("Clear button clears input fields", function () { return __awaiter(void 0, void 0, void 0, function () {
        var minInput, maxInput, clearButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    renderWithRelay({
                        Artist: function () { return artist; },
                    });
                    // wait for suspense to go away
                    return [4 /*yield*/, (0, react_native_1.waitForElementToBeRemoved)(function () { return react_native_1.screen.queryByTestId("alert-price-range-spinner"); })];
                case 1:
                    // wait for suspense to go away
                    _a.sent();
                    minInput = react_native_1.screen.getByTestId("price-min-input");
                    maxInput = react_native_1.screen.getByTestId("price-max-input");
                    expect(minInput.props.value).toBe("800");
                    expect(maxInput.props.value).toBe("1500");
                    clearButton = react_native_1.screen.getByText("Clear");
                    react_native_1.fireEvent.press(clearButton);
                    expect(minInput.props.value).toBe("");
                    expect(maxInput.props.value).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    it("Set Price Range button sets price range attribute, navigates back and saves recent price range", function () { return __awaiter(void 0, void 0, void 0, function () {
        var submitButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    renderWithRelay({
                        Artist: function () { return artist; },
                    });
                    // wait for suspense to go away
                    return [4 /*yield*/, (0, react_native_1.waitForElementToBeRemoved)(function () { return react_native_1.screen.queryByTestId("alert-price-range-spinner"); })];
                case 1:
                    // wait for suspense to go away
                    _a.sent();
                    submitButton = react_native_1.screen.getByText("Set Price Range");
                    react_native_1.fireEvent.press(submitButton);
                    expect(goBackMock).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
var savedSearchEntity = {
    artists: [{ id: "artistID", name: "artistName" }],
    owner: {
        type: cohesion_1.OwnerType.artist,
        id: "ownerId",
        slug: "ownerSlug",
    },
};
var attributes = {
    artistIDs: ["artistID"],
    priceRange: "800-1500",
};
var artist = {
    filterArtworksConnection: {
        aggregations: [
            {
                slice: "SIMPLE_PRICE_HISTOGRAM",
                counts: [
                    {
                        count: 1288,
                        name: "0",
                        value: "0",
                    },
                    {
                        count: 483,
                        name: "50000",
                        value: "50000",
                    },
                ],
            },
        ],
    },
};
