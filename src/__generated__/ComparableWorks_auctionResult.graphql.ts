/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ComparableWorks_auctionResult = {
    readonly comparableAuctionResults: {
        readonly edges: ReadonlyArray<{
            readonly cursor: string;
            readonly node: {
                readonly artistID: string;
                readonly internalID: string;
                readonly " $fragmentRefs": FragmentRefs<"AuctionResultListItem_auctionResult">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ComparableWorks_auctionResult";
};
export type ComparableWorks_auctionResult$data = ComparableWorks_auctionResult;
export type ComparableWorks_auctionResult$key = {
    readonly " $data"?: ComparableWorks_auctionResult$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ComparableWorks_auctionResult">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ComparableWorks_auctionResult",
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
(node as any).hash = '728d224b9ccbe709da270787ffa81726';
export default node;
