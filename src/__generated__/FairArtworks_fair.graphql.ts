/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAggregation = "ARTIST" | "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "MAJOR_PERIOD" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
export type FairArtworks_fair = {
    readonly slug: string;
    readonly internalID: string;
    readonly fairArtworks: {
        readonly aggregations: ReadonlyArray<{
            readonly slice: ArtworkAggregation | null;
            readonly counts: ReadonlyArray<{
                readonly count: number;
                readonly name: string;
                readonly value: string;
            } | null> | null;
        } | null> | null;
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
            } | null;
        } | null> | null;
        readonly counts: {
            readonly total: number | null;
            readonly followedArtists: number | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"InfiniteScrollArtworksGrid_connection">;
    } | null;
    readonly " $refType": "FairArtworks_fair";
};
export type FairArtworks_fair$data = FairArtworks_fair;
export type FairArtworks_fair$key = {
    readonly " $data"?: FairArtworks_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"FairArtworks_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "acquireable"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "artistIDs"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "atAuction"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "attributionClass"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "color"
    },
    {
      "defaultValue": 30,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": "*-*",
      "kind": "LocalArgument",
      "name": "dimensionRange"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "includeArtworksByFollowedArtists"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "inquireableOnly"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "majorPeriods"
    },
    {
      "defaultValue": "*",
      "kind": "LocalArgument",
      "name": "medium"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "offerable"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "partnerID"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "priceRange"
    },
    {
      "defaultValue": "-decayed_merch",
      "kind": "LocalArgument",
      "name": "sort"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "fairArtworks"
        ]
      }
    ]
  },
  "name": "FairArtworks_fair",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": "fairArtworks",
      "args": [
        {
          "kind": "Variable",
          "name": "acquireable",
          "variableName": "acquireable"
        },
        {
          "kind": "Literal",
          "name": "aggregations",
          "value": [
            "COLOR",
            "DIMENSION_RANGE",
            "GALLERY",
            "INSTITUTION",
            "MAJOR_PERIOD",
            "MEDIUM",
            "PRICE_RANGE",
            "FOLLOWED_ARTISTS",
            "ARTIST"
          ]
        },
        {
          "kind": "Variable",
          "name": "artistIDs",
          "variableName": "artistIDs"
        },
        {
          "kind": "Variable",
          "name": "atAuction",
          "variableName": "atAuction"
        },
        {
          "kind": "Variable",
          "name": "attributionClass",
          "variableName": "attributionClass"
        },
        {
          "kind": "Variable",
          "name": "color",
          "variableName": "color"
        },
        {
          "kind": "Variable",
          "name": "dimensionRange",
          "variableName": "dimensionRange"
        },
        {
          "kind": "Variable",
          "name": "includeArtworksByFollowedArtists",
          "variableName": "includeArtworksByFollowedArtists"
        },
        {
          "kind": "Variable",
          "name": "inquireableOnly",
          "variableName": "inquireableOnly"
        },
        {
          "kind": "Variable",
          "name": "majorPeriods",
          "variableName": "majorPeriods"
        },
        {
          "kind": "Variable",
          "name": "medium",
          "variableName": "medium"
        },
        {
          "kind": "Variable",
          "name": "offerable",
          "variableName": "offerable"
        },
        {
          "kind": "Variable",
          "name": "partnerID",
          "variableName": "partnerID"
        },
        {
          "kind": "Variable",
          "name": "priceRange",
          "variableName": "priceRange"
        },
        {
          "kind": "Variable",
          "name": "sort",
          "variableName": "sort"
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "kind": "LinkedField",
      "name": "__Fair_fairArtworks_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ArtworksAggregationResults",
          "kind": "LinkedField",
          "name": "aggregations",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "slice",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AggregationCount",
              "kind": "LinkedField",
              "name": "counts",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "count",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "name",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "value",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "FilterArtworksEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Artwork",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
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
          "concreteType": "FilterArtworksCounts",
          "kind": "LinkedField",
          "name": "counts",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "total",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "followedArtists",
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
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "InfiniteScrollArtworksGrid_connection"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = 'e8b34b7dd5a4f2647e72d2507678b357';
export default node;
