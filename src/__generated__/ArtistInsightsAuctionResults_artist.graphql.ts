/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistInsightsAuctionResults_artist = {
    readonly auctionResultsConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly " $fragmentRefs": FragmentRefs<"ArtistInsightsAuctionResult_auctionResult">;
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



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistInsightsAuctionResults_artist",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "DATE_DESC"
        }
      ],
      "concreteType": "AuctionResultConnection",
      "kind": "LinkedField",
      "name": "auctionResultsConnection",
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
              "concreteType": "AuctionResult",
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
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ArtistInsightsAuctionResult_auctionResult"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "auctionResultsConnection(first:10,sort:\"DATE_DESC\")"
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = '68d72dd77bedf5a4d9ef360be1904898';
export default node;
