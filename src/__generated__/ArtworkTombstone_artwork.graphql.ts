/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _ArtworkTombstone_artwork$ref: unique symbol;
export type ArtworkTombstone_artwork$ref = typeof _ArtworkTombstone_artwork$ref;
export type ArtworkTombstone_artwork = {
    readonly title: string | null;
    readonly medium: string | null;
    readonly date: string | null;
    readonly cultural_maker: string | null;
    readonly artists: ReadonlyArray<({
        readonly __id: string;
        readonly name: string | null;
        readonly href: string | null;
    }) | null> | null;
    readonly dimensions: ({
        readonly in: string | null;
        readonly cm: string | null;
    }) | null;
    readonly edition_of: string | null;
    readonly attribution_class: ({
        readonly short_description: string | null;
    }) | null;
    readonly " $refType": ArtworkTombstone_artwork$ref;
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
  "name": "ArtworkTombstone_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "medium",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "date",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "cultural_maker",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        v0,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
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
      "kind": "LinkedField",
      "alias": null,
      "name": "dimensions",
      "storageKey": null,
      "args": null,
      "concreteType": "dimensions",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "in",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "cm",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "edition_of",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "attribution_class",
      "storageKey": null,
      "args": null,
      "concreteType": "AttributionClass",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "short_description",
          "args": null,
          "storageKey": null
        }
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '9fbd2b64d3561273488e238b5f3fab6b';
export default node;
