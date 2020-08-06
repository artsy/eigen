/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyBids_me = {
    readonly lotStandings: ReadonlyArray<{
        readonly isHighestBidder: boolean | null;
        readonly isLeadingBidder: boolean | null;
        readonly sale: {
            readonly displayTimelyAt: string | null;
            readonly liveStartAt: string | null;
            readonly endAt: string | null;
        } | null;
        readonly saleArtwork: {
            readonly id: string;
            readonly lotLabel: string | null;
            readonly counts: {
                readonly bidderPositions: number | null;
            } | null;
            readonly currentBid: {
                readonly display: string | null;
            } | null;
            readonly artwork: {
                readonly artistNames: string | null;
                readonly href: string | null;
                readonly image: {
                    readonly url: string | null;
                } | null;
            } | null;
        } | null;
    } | null> | null;
    readonly " $refType": "MyBids_me";
};
export type MyBids_me$data = MyBids_me;
export type MyBids_me$key = {
    readonly " $data"?: MyBids_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyBids_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyBids_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "lotStandings",
      "storageKey": null,
      "args": null,
      "concreteType": "LotStanding",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isHighestBidder",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isLeadingBidder",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "sale",
          "storageKey": null,
          "args": null,
          "concreteType": "Sale",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "displayTimelyAt",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "liveStartAt",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "endAt",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "saleArtwork",
          "storageKey": null,
          "args": null,
          "concreteType": "SaleArtwork",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "id",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "lotLabel",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "counts",
              "storageKey": null,
              "args": null,
              "concreteType": "SaleArtworkCounts",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "bidderPositions",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "currentBid",
              "storageKey": null,
              "args": null,
              "concreteType": "SaleArtworkCurrentBid",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "display",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "artwork",
              "storageKey": null,
              "args": null,
              "concreteType": "Artwork",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "artistNames",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "href",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "image",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Image",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "url",
                      "args": [
                        {
                          "kind": "Literal",
                          "name": "version",
                          "value": "medium"
                        }
                      ],
                      "storageKey": "url(version:\"medium\")"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '4c3f29f15d3d2acbfab11af0f3dd00dc';
export default node;
