/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Notification_notification = {
    readonly summary: string | null;
    readonly artists: string | null;
    readonly artworks: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly artists: ReadonlyArray<{
                    readonly href: string | null;
                } | null> | null;
                readonly " $fragmentRefs": FragmentRefs<"GenericGrid_artworks">;
            } | null;
        } | null> | null;
    } | null;
    readonly image: {
        readonly resized: {
            readonly url: string;
        } | null;
    } | null;
    readonly " $refType": "Notification_notification";
};
export type Notification_notification$data = Notification_notification;
export type Notification_notification$key = {
    readonly " $data"?: Notification_notification$data;
    readonly " $fragmentRefs": FragmentRefs<"Notification_notification">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Notification_notification",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "summary",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "artists",
      "storageKey": null
    },
    {
      "alias": "artworks",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        }
      ],
      "concreteType": "ArtworkConnection",
      "kind": "LinkedField",
      "name": "artworksConnection",
      "plural": false,
      "selections": [
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
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "shallow",
                      "value": true
                    }
                  ],
                  "concreteType": "Artist",
                  "kind": "LinkedField",
                  "name": "artists",
                  "plural": true,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "href",
                      "storageKey": null
                    }
                  ],
                  "storageKey": "artists(shallow:true)"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "GenericGrid_artworks"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "artworksConnection(first:10)"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "height",
              "value": 80
            },
            {
              "kind": "Literal",
              "name": "width",
              "value": 80
            }
          ],
          "concreteType": "ResizedImageUrl",
          "kind": "LinkedField",
          "name": "resized",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "url",
              "storageKey": null
            }
          ],
          "storageKey": "resized(height:80,width:80)"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "FollowedArtistsArtworksGroup",
  "abstractKey": null
};
(node as any).hash = '0de17c33986f81a634195f7d3e29d97c';
export default node;
