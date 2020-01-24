/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Collection_collection = {
    readonly id: string;
    readonly slug: string;
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
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
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
(node as any).hash = '95b26f4c31f7a686614f53ca0ab82bdc';
export default node;
