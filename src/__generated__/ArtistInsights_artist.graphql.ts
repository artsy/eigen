/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistInsights_artist = {
    readonly auctionResultsConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly title: string | null;
                readonly dateText: string | null;
                readonly mediumText: string | null;
                readonly organization: string | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtistInsights_artist";
};
export type ArtistInsights_artist$data = ArtistInsights_artist;
export type ArtistInsights_artist$key = {
    readonly " $data"?: ArtistInsights_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistInsights_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistInsights_artist",
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
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "title",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "dateText",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "mediumText",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "organization",
                  "storageKey": null
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
(node as any).hash = '96a5256c752eb6ae20d7c2129d41d20b';
export default node;
