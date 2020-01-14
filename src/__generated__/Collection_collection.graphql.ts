/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Collection_collection = {
    readonly " $fragmentRefs": FragmentRefs<"CollectionHeader_collection" | "CollectionArtworks_collection" | "FeaturedArtists_collection">;
    readonly " $refType": "Collection_collection";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Collection_collection",
  "type": "MarketingCollection",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "screenWidth",
      "type": "Int",
      "defaultValue": 500
    }
  ],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "CollectionHeader_collection",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "CollectionArtworks_collection",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FeaturedArtists_collection",
      "args": [
        {
          "kind": "Variable",
          "name": "screenWidth",
          "variableName": "screenWidth"
        }
      ]
    }
  ]
};
(node as any).hash = '9f9d3752500c35790e065398fa7d0575';
export default node;
