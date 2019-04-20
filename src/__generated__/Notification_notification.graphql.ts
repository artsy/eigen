/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _Notification_notification$ref: unique symbol;
export type Notification_notification$ref = typeof _Notification_notification$ref;
export type Notification_notification = {
    readonly summary: string | null;
    readonly artists: string | null;
    readonly artworks: ReadonlyArray<({
        readonly artists: ReadonlyArray<({
            readonly href: string | null;
        }) | null> | null;
        readonly " $fragmentRefs": GenericGrid_artworks$ref;
    }) | null> | null;
    readonly image: ({
        readonly resized: ({
            readonly url: string | null;
        }) | null;
    }) | null;
    readonly " $refType": Notification_notification$ref;
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
      "alias": null,
      "name": "artworks",
      "storageKey": null,
      "args": null,
      "concreteType": "Artwork",
      "plural": true,
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
              "value": true,
              "type": "Boolean"
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
              "value": 80,
              "type": "Int"
            },
            {
              "kind": "Literal",
              "name": "width",
              "value": 80,
              "type": "Int"
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
(node as any).hash = '9bcd451b9edfda79aacce192d92db290';
export default node;
