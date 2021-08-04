/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EditSavedSearchAlert_me = {
    readonly savedSearch: {
        readonly internalID: string;
        readonly acquireable: boolean | null;
        readonly additionalGeneIDs: ReadonlyArray<string>;
        readonly artistID: string | null;
        readonly atAuction: boolean | null;
        readonly attributionClass: ReadonlyArray<string>;
        readonly colors: ReadonlyArray<string>;
        readonly dimensionRange: string | null;
        readonly height: string | null;
        readonly inquireableOnly: boolean | null;
        readonly locationCities: ReadonlyArray<string>;
        readonly majorPeriods: ReadonlyArray<string>;
        readonly materialsTerms: ReadonlyArray<string>;
        readonly offerable: boolean | null;
        readonly partnerIDs: ReadonlyArray<string>;
        readonly priceRange: string | null;
        readonly userAlertSettings: {
            readonly name: string | null;
        };
        readonly width: string | null;
    } | null;
    readonly " $refType": "EditSavedSearchAlert_me";
};
export type EditSavedSearchAlert_me$data = EditSavedSearchAlert_me;
export type EditSavedSearchAlert_me$key = {
    readonly " $data"?: EditSavedSearchAlert_me$data;
    readonly " $fragmentRefs": FragmentRefs<"EditSavedSearchAlert_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "savedSearchAlertId"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditSavedSearchAlert_me",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "id",
          "variableName": "savedSearchAlertId"
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
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "acquireable",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "additionalGeneIDs",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "artistID",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "atAuction",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "attributionClass",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "colors",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "dimensionRange",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "height",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "inquireableOnly",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "locationCities",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "majorPeriods",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "materialsTerms",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "offerable",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "partnerIDs",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "priceRange",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "SavedSearchUserAlertSettings",
          "kind": "LinkedField",
          "name": "userAlertSettings",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "name",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "width",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '69486a50caba11c836bb6eafc20da1eb';
export default node;
