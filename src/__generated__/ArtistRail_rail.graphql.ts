/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type ArtistRail_rail = {
    readonly __id: string;
    readonly key: string | null;
    readonly results?: ReadonlyArray<({
            readonly _id: string;
            readonly __id: string;
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
  "name": "ArtistRail_rail",
  "type": "HomePageArtistModule",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "fetchContent",
      "type": "Boolean!",
      "defaultValue": false
    }
  ],
  "selections": [
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "key",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "Condition",
      "passingValue": true,
      "condition": "fetchContent",
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "results",
          "storageKey": null,
          "args": null,
          "concreteType": "Artist",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "_id",
              "args": null,
              "storageKey": null
            },
            v0,
            {
              "kind": "FragmentSpread",
              "name": "ArtistCard_artist",
              "args": null
            }
          ],
          "idField": "__id"
        }
      ]
    }
  ],
  "idField": "__id"
};
})();
(node as any).hash = '7318209746f30396590ed7fad9d8db09';
export default node;
