/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LotsByFollowedArtists_query = {
    readonly me: {
        readonly lotsByFollowedArtistsConnection: {
            readonly edges: ReadonlyArray<{
                readonly cursor: string | null;
            } | null> | null;
            readonly " $fragmentRefs": FragmentRefs<"InfiniteScrollArtworksGrid_connection">;
        } | null;
    } | null;
    readonly " $refType": "LotsByFollowedArtists_query";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "LotsByFollowedArtists_query",
  "type": "Query",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "me",
          "lotsByFollowedArtistsConnection"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "me",
      "storageKey": null,
      "args": null,
      "concreteType": "Me",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "lotsByFollowedArtistsConnection",
          "name": "__LotsByFollowedArtists_lotsByFollowedArtistsConnection_connection",
          "storageKey": "__LotsByFollowedArtists_lotsByFollowedArtistsConnection_connection(isAuction:true,liveSale:true)",
          "args": [
            {
              "kind": "Literal",
              "name": "isAuction",
              "value": true
            },
            {
              "kind": "Literal",
              "name": "liveSale",
              "value": true
            }
          ],
          "concreteType": "SaleArtworksConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "SaleArtwork",
              "plural": true,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "cursor",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "node",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Artwork",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "__typename",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                }
              ]
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "pageInfo",
              "storageKey": null,
              "args": null,
              "concreteType": "PageInfo",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "endCursor",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "hasNextPage",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "FragmentSpread",
              "name": "InfiniteScrollArtworksGrid_connection",
              "args": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '9360e160572ac233819b110f0d98c44d';
export default node;
