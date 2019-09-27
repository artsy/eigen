"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var _this = this;
exports.__esModule = true;
var renderRelayTree_1 = require("lib/tests/renderRelayTree");
var react_1 = require("react");
var react_relay_1 = require("react-relay");
var ArtistFixture_1 = require("../../__fixtures__/ArtistFixture");
var ArtistListItem_1 = require("../ArtistListItem");
jest.unmock("react-relay");
describe("ArtistListItem", function () {
    var render = function () {
        return renderRelayTree_1.renderRelayTree({
            Component: function (_a) {
                var artist = _a.artist;
                return <ArtistListItem_1.ArtistListItemContainer artist={artist}/>;
            },
            query: react_relay_1.graphql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        query ArtistListItemTestsQuery @raw_response_type {\n          artist(id: \"pablo-picasso\") {\n            ...ArtistListItem_artist\n          }\n        }\n      "], ["\n        query ArtistListItemTestsQuery @raw_response_type {\n          artist(id: \"pablo-picasso\") {\n            ...ArtistListItem_artist\n          }\n        }\n      "]))),
            mockData: {
                artist: ArtistFixture_1.ArtistFixture
            }
        });
    };
    it("renders properly", function () { return __awaiter(_this, void 0, void 0, function () {
        var tree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, render()];
                case 1:
                    tree = _a.sent();
                    expect(tree.html()).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("formatTombstoneText", function () {
    it("formats with birthday and deathday", function () {
        expect(ArtistListItem_1.formatTombstoneText("American", "1990", "2014")).toBe("American, 1990-2014");
    });
    it("formats with only birthday and nationality", function () {
        expect(ArtistListItem_1.formatTombstoneText("American", "1990", "")).toBe("American, b. 1990");
    });
    it("formats with only nationality", function () {
        expect(ArtistListItem_1.formatTombstoneText("American", "", "")).toBe("American");
    });
    it("formats without nationality", function () {
        expect(ArtistListItem_1.formatTombstoneText("", "1990", "2014")).toBe("1990-2014");
    });
    it("formats with only birthday", function () {
        expect(ArtistListItem_1.formatTombstoneText("", "1990", "")).toBe("b. 1990");
    });
});
var templateObject_1;
