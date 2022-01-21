/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type NewWorksForYouRail_me = {
    readonly newWorksByInterestingArtists: {
        readonly pageInfo: {
            readonly hasNextPage: boolean;
            readonly startCursor: string | null;
            readonly endCursor: string | null;
        };
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"SmallArtworkRail_artworks">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "NewWorksForYouRail_me";
};
export type NewWorksForYouRail_me$data = NewWorksForYouRail_me;
export type NewWorksForYouRail_me$key = {
    readonly " $data"?: NewWorksForYouRail_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"NewWorksForYouRail_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": 6,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
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
          "newWorksByInterestingArtists"
        ]
      }
    ]
  },
  "name": "NewWorksForYouRail_me",
  "selections": [
    {
      "alias": "newWorksByInterestingArtists",
      "args": null,
      "concreteType": "ArtworkConnection",
      "kind": "LinkedField",
      "name": "__NewWorksForYouRail_newWorksByInterestingArtists_connection",
      "plural": false,
      "selections": [
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
              "name": "hasNextPage",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "startCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "ArtworkEdge",
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
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "SmallArtworkRail_artworks"
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '8e821bddebf34ea9ed443fcc060388a0';
export default node;
