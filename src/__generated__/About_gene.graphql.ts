/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type About_gene = {
    readonly trending_artists: ReadonlyArray<({
        }) | null> | null;
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
      ],
      "idField": "__id"
    },
    v0
  ],
  "idField": "__id"
};
})();
(node as any).hash = 'f49aab34dd4e87ee0079aac465f2313a';
export default node;
