/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistInsightsAuctionResults_artist = {
    readonly birthday: string | null;
    readonly slug: string;
    readonly id: string;
    readonly internalID: string;
    readonly auctionResultsConnection: {
        readonly createdYearRange: {
            readonly startAt: number | null;
            readonly endAt: number | null;
        } | null;
        readonly totalCount: number | null;
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly internalID: string;
                readonly " $fragmentRefs": FragmentRefs<"AuctionResult_auctionResult">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtistInsightsAuctionResults_artist";
};
export type ArtistInsightsAuctionResults_artist$data = ArtistInsightsAuctionResults_artist;
export type ArtistInsightsAuctionResults_artist$key = {
    readonly " $data"?: ArtistInsightsAuctionResults_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistInsightsAuctionResults_artist">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "allowEmptyCreatedDates"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "categories"
    },
    {
      "defaultValue": 10,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": 1000,
      "kind": "LocalArgument",
      "name": "earliestCreatedYear"
    },
    {
      "defaultValue": 2050,
      "kind": "LocalArgument",
      "name": "latestCreatedYear"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "sizes"
    },
    {
      "defaultValue": "DATE_DESC",
      "kind": "LocalArgument",
      "name": "sort"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "auctionResultsConnection"
        ]
      }
    ]
  },
  "name": "ArtistInsightsAuctionResults_artist",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "birthday",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": "auctionResultsConnection",
      "args": [
        {
          "kind": "Variable",
          "name": "allowEmptyCreatedDates",
          "variableName": "allowEmptyCreatedDates"
        },
        {
          "kind": "Variable",
          "name": "categories",
          "variableName": "categories"
        },
        {
          "kind": "Variable",
          "name": "earliestCreatedYear",
          "variableName": "earliestCreatedYear"
        },
        {
          "kind": "Variable",
          "name": "latestCreatedYear",
          "variableName": "latestCreatedYear"
        },
        {
          "kind": "Variable",
          "name": "sizes",
          "variableName": "sizes"
        },
        {
          "kind": "Variable",
          "name": "sort",
          "variableName": "sort"
        }
      ],
      "concreteType": "AuctionResultConnection",
      "kind": "LinkedField",
      "name": "__artist_auctionResultsConnection_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "YearRange",
          "kind": "LinkedField",
          "name": "createdYearRange",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "startAt",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endAt",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "AuctionResultEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "AuctionResult",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "AuctionResult_auctionResult"
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
})();
(node as any).hash = 'ecf483180f50bb5ad551070484de1045';
export default node;
