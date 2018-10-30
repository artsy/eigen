/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _Artworks_show$ref: unique symbol;
export type Artworks_show$ref = typeof _Artworks_show$ref;
export type Artworks_show = {
    readonly __id: string;
    readonly artworks: ReadonlyArray<({
        readonly " $fragmentRefs": GenericGrid_artworks$ref;
    }) | null> | null;
    readonly " $refType": Artworks_show$ref;
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
  "name": "Artworks_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
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
          "kind": "FragmentSpread",
          "name": "GenericGrid_artworks",
          "args": null
        },
        v0
      ]
    }
  ]
};
})();
(node as any).hash = 'ee953b6e7c6519b43f08a41934fcf621';
export default node;
