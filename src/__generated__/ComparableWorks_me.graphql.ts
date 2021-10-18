/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ComparableWorks_me = {
    readonly auctionResultsByFollowedArtists: {
        readonly totalCount: number | null;
        readonly edges: ReadonlyArray<{
            readonly cursor: string;
            readonly node: {
                readonly artistID: string;
                readonly internalID: string;
                readonly " $fragmentRefs": FragmentRefs<"AuctionResultListItem_auctionResult">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ComparableWorks_me";
};
export type ComparableWorks_me$data = ComparableWorks_me;
export type ComparableWorks_me$key = {
    readonly " $data"?: ComparableWorks_me$data;
    readonly " $fragmentRefs": FragmentRefs<"ComparableWorks_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ComparableWorks_me",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        }
      ],
      "concreteType": "AuctionResultConnection",
      "kind": "LinkedField",
      "name": "auctionResultsByFollowedArtists",
      "plural": false,
      "selections": [
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
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AuctionResult",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "artistID",
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
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "AuctionResultListItem_auctionResult"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "auctionResultsByFollowedArtists(first:3)"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '12edee2eb38b14e47a0c2180d2fde5fd';
export default node;
