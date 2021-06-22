/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionResultsRail_me = {
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
    readonly " $refType": "AuctionResultsRail_me";
};
export type AuctionResultsRail_me$data = AuctionResultsRail_me;
export type AuctionResultsRail_me$key = {
    readonly " $data"?: AuctionResultsRail_me$data;
    readonly " $fragmentRefs": FragmentRefs<"AuctionResultsRail_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AuctionResultsRail_me",
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
(node as any).hash = 'cf7079894134d7ded2654593eac9f58c';
export default node;
