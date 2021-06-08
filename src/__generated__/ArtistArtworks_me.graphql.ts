/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistArtworks_me = {
    readonly name: string | null;
    readonly savedSearch: {
        readonly internalID: string;
    } | null;
    readonly " $refType": "ArtistArtworks_me";
};
export type ArtistArtworks_me$data = ArtistArtworks_me;
export type ArtistArtworks_me$key = {
    readonly " $data"?: ArtistArtworks_me$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistArtworks_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "criteria"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistArtworks_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "criteria",
          "variableName": "criteria"
        }
      ],
      "concreteType": "SearchCriteria",
      "kind": "LinkedField",
      "name": "savedSearch",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '6cfd836b4f76bd4cfcf5e8de53350a51';
export default node;
