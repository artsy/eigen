# Adding State Migrations

## Do I need to add a state migration?

Probably not! 🙂 Most changes to the app only involve creating some new UI and fetching data for it with Relay. In those cases you don't need to worry about migrations. However, if you're working on something that involves managing application state beyond Relay data, then please read on...

When the app launches we do something like

    initialAppState = merge(blankAppState, loadSavedStateFromDeviceStorage())

It is possible to make a code change that would cause this step to produce a corrupt `initialAppState` the next time the user updates their app. To mitigate this we add in a `migrate` step so that old versions of the app state can be brought up-to-date before merging.

    initialAppState = merge(blankAppState, migrate(loadSavedStateFromDeviceStorage()))

When we make a change to the app store which could affect what is stored on disk, we need to create a new migration.

The following kinds of change do _not_ require creating a new migration:

- Modifying anything which is only stored within a `sessionState` portion of the app store.
- Adding or removing a `sessionState` object.
- Modifying, adding, or removing a [computed](https://easy-peasy.now.sh/docs/api/computed.html) property.
- Modifying, adding, or removing [actions](https://easy-peasy.now.sh/docs/api/action.html) or [thunks](https://easy-peasy.now.sh/docs/api/thunk.html).

The following kinds of changes to easy-peasy models in the global app store will **always** require a migration:

- Adding a property
  ```diff
   interface MyModel = {
     existingProperty: string
  +  newProperty: number
     existingAction: action(...)
   }
  ```
- Removing a property
  ```diff
   interface MyModel = {
     existingProperty: string
  -  anotherExistingProperty: number
     existingAction: action(...)
   }
  ```
- Renaming a property
  ```diff
   interface MyModel = {
     existingProperty: string
  -  oldPropertyName: string
  +  newPropertyName: string
     existingAction: action(...)
   }
  ```
- Changing a property's type
  ```diff
   interface MyModel = {
  -  existingProperty: string
  +  existingProperty: number
     existingAction: action(...)
   }
  ```
- Doing any of the above inside an array element type
  ```diff
   interface MyModel = {
     existingProperty: string
     existingCollection: Array<{
       id: string
       name: string
  +    birthday: string
       phoneNumber: string
     }>
     existingAction: action(...)
   }
  ```

Remember, if your changes affect the structure of the persisted version of the app store (everything you declare in a model except `sessionState`, computed properties, actions, and thunks) then you need to add a migration.

If you're still unsure whether your change requires a new migration, please reach out to a one of the repository code owners! 🙏

## How to add a new state migration

1. Navigate to `migration.ts`.
2. Increment `CURRENT_APP_VERSION`.

   ```diff
   -const CURRENT_APP_VERSION = 41
   +const CURRENT_APP_VERSION = 42
   ```

3. Add a new migration in the `migrations` object.

   e.g. to rename a property from `oldName` to `newName`

   ```diff
    const migrations = {
   +   [42]: state => {
   +      state.myModule.newName = state.myModule.oldName
   +      delete state.myModule.oldName
   +   }
    }
   ```

   e.g. to add a new property called `newProperty` with a default value of `"default_value"`

   ```diff
    const migrations = {
   +   [42]: state => {
   +      state.myModule.newProperty = "default_value"
   +   }
    }
   ```

   e.g. to remove an existing property called `oldProperty`.

   ```diff
    const migrations = {
   +   [42]: state => {
   +      delete state.myModule.oldProperty
   +   }
    }
   ```

   e.g. to update the items in an array

   ```diff
    const migrations = {
   +   [42]: state => {
   +     state.myModule.arrayOfThings.forEach(thing => {
   +       thing.newProperty = "default_value"
   +       thing.newName = thing.oldName
   +       delete thing.oldName
   +     })
   +   }
    }
   ```

4. Test your migration in `migration-tests.ts`.

   ```ts
   describe("App version 42", () => {
     it("renames `oldName` to `newName`", () => {
       const result = migrate({ state: { version: 0 } })
       expect(result).toMatchObject({
         version: 42,
         myModule: {
           newName: "blah",
         },
       })
       expect("oldName" in result.myModule).toBe(false)
     })
   })
   ```

   If you're testing something that _modifies_ a property's value, e.g. updating the items in an array or changing a property's type, make sure to test with saturated data.

   ```ts
   describe("App version 42", () => {
     it("renames `oldName` to `newName` in `arrayOfThings`", () => {
       // This will get you a 'blank' copy of app state version 41
       const previousState = migrate({ state: { version: 0 }, toVersion: 41 })
       // saturate it with some data
       previousState.myModule.arrayOfThings = [
         { id: "thing1", oldName: "William" },
         { id: "thing2", oldName: "Siobhan" },
       ]
       // test that the array data was migrated properly
       const result = migrate({ state: previousState })
       expect(result).toMatchObject({
         version: 42,
         myModule: {
           arrayOfThings: [
             { id: "thing1", newName: "William" },
             { id: "thing1", newName: "Siobhan" },
           ],
         },
       })
       expect("oldName" in result.myModule).toBe(false)
     })
   })
   ```

5. Test your migration manually on a device.
   1. Remove the app from your phone.
   2. Install the latest beta from TestFlight.
   3. Log in and perform actions to accumulate some of the state that will be affected by your changes.
   4. Install your development version of the app from Xcode.
   5. Check that the affected code works as intended.
