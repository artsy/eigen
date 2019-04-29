/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { Biography_gene$ref } from "./Biography_gene.graphql";
import { RelatedArtists_artists$ref } from "./RelatedArtists_artists.graphql";
declare const _About_gene$ref: unique symbol;
export type About_gene$ref = typeof _About_gene$ref;
export type About_gene = {
    readonly trending_artists: ReadonlyArray<({
        readonly " $fragmentRefs": RelatedArtists_artists$ref;
    }) | null> | null;
    readonly " $fragmentRefs": Biography_gene$ref;
    readonly " $refType": About_gene$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "About_gene",
  "type": "Gene",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Biography_gene",
      "args": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "trending_artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "RelatedArtists_artists",
          "args": null
        },
        v0
      ]
    },
    v0
  ]
};
})();
(node as any).hash = 'f49aab34dd4e87ee0079aac465f2313a';
export default node;
