/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollection_me = {
    readonly id: string;
    readonly myCollectionInfo: {
        readonly includesPurchasedArtworks: boolean;
    } | null;
    readonly myCollectionConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly medium: string | null;
                readonly artist: {
                    readonly internalID: string;
                    readonly name: string | null;
                } | null;
            } | null;
        } | null> | null;
        readonly " $fragmentRefs": FragmentRefs<"InfiniteScrollArtworksGrid_myCollectionConnection">;
    } | null;
    readonly " $refType": "MyCollection_me";
};
export type MyCollection_me$data = MyCollection_me;
export type MyCollection_me$key = {
    readonly " $data"?: MyCollection_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollection_me">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": 100,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "excludePurchasedArtworks"
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
          "myCollectionConnection"
        ]
      }
    ]
  },
  "name": "MyCollection_me",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "MyCollectionInfo",
      "kind": "LinkedField",
      "name": "myCollectionInfo",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "includesPurchasedArtworks",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": "myCollectionConnection",
      "args": null,
      "concreteType": "MyCollectionConnection",
      "kind": "LinkedField",
      "name": "__MyCollection_myCollectionConnection_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "MyCollectionEdge",
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
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "medium",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Artist",
                  "kind": "LinkedField",
                  "name": "artist",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "internalID",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "name",
                      "storageKey": null
                    }
                  ],
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
          "args": [
            {
              "kind": "Literal",
              "name": "skipArtworkGridItem",
              "value": true
            }
          ],
          "kind": "FragmentSpread",
          "name": "InfiniteScrollArtworksGrid_myCollectionConnection"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
})();
(node as any).hash = '4c94cd7f0dc4711d88ea5b42a02973b3';
export default node;
