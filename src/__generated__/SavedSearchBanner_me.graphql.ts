/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SavedSearchBanner_me = {
    readonly savedSearch: {
        readonly internalID: string;
    } | null;
    readonly " $refType": "SavedSearchBanner_me";
};
export type SavedSearchBanner_me$data = SavedSearchBanner_me;
export type SavedSearchBanner_me$key = {
    readonly " $data"?: SavedSearchBanner_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SavedSearchBanner_me">;
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
  "name": "SavedSearchBanner_me",
  "selections": [
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
(node as any).hash = 'ba718ab14d3a5c00afa6b2fb930f9fab';
export default node;
