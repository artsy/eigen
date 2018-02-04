/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Notification_notification = {
    readonly summary: string | null;
    readonly artists: string | null;
    readonly artworks: ReadonlyArray<({
            readonly artists: ReadonlyArray<({
                    readonly href: string | null;
                }) | null> | null;
        }) | null> | null;
    readonly image: ({
        readonly resized: ({
            readonly url: string | null;
        }) | null;
    }) | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
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
            },
            v0
          ],
          "idField": "__id"
        },
        {
          "kind": "FragmentSpread",
          "name": "GenericGrid_artworks",
          "args": null
        },
        v0
      ],
      "idField": "__id"
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
    },
    v0
  ],
  "idField": "__id"
};
})();
(node as any).hash = '9bcd451b9edfda79aacce192d92db290';
export default node;
