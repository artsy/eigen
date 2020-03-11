/* tslint:disable */

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
            readonly url: string | null;
        } | null;
    } | null;
    readonly " $refType": "Notification_notification";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Notification_notification",
  "type": "FollowedArtistsArtworksGroup",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "summary",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "artists",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "artworks",
      "name": "artworksConnection",
      "storageKey": "artworksConnection(first:10)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        }
      ],
      "concreteType": "ArtworkConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtworkEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artwork",
              "plural": false,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "artists",
                  "storageKey": "artists(shallow:true)",
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "shallow",
                      "value": true
                    }
                  ],
                  "concreteType": "Artist",
                  "plural": true,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "href",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                },
                {
                  "kind": "FragmentSpread",
                  "name": "GenericGrid_artworks",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
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
          "kind": "LinkedField",
          "alias": null,
          "name": "resized",
          "storageKey": "resized(height:80,width:80)",
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
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "url",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '0de17c33986f81a634195f7d3e29d97c';
export default node;
