/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SavedSearchButton_me = {
    readonly savedSearch: {
        readonly internalID: string;
    } | null;
    readonly " $refType": "SavedSearchButton_me";
};
export type SavedSearchButton_me$data = SavedSearchButton_me;
export type SavedSearchButton_me$key = {
    readonly " $data"?: SavedSearchButton_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SavedSearchButton_me">;
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
  "name": "SavedSearchButton_me",
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
(node as any).hash = '47929e285b919e81f21a8625678edd09';
export default node;
