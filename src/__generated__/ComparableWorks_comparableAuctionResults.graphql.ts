/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ComparableWorks_comparableAuctionResults = {
    readonly comparableAuctionResults: {
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
    readonly " $refType": "ComparableWorks_comparableAuctionResults";
};
export type ComparableWorks_comparableAuctionResults$data = ComparableWorks_comparableAuctionResults;
export type ComparableWorks_comparableAuctionResults$key = {
    readonly " $data"?: ComparableWorks_comparableAuctionResults$data;
    readonly " $fragmentRefs": FragmentRefs<"ComparableWorks_comparableAuctionResults">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ComparableWorks_comparableAuctionResults",
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
      "name": "comparableAuctionResults",
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
      "storageKey": "comparableAuctionResults(first:3)"
    }
  ],
  "type": "AuctionResult",
  "abstractKey": null
};
(node as any).hash = '883b0eae47b3ba9a54230415634c89e8';
export default node;
