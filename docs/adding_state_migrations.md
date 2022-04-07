# State Migrations

## What is a migration?

Sometimes we make a code change that can cause a corrupted `initialAppState` the next time the user updates their app. 

To mitigate this we add in a `migrate` step so that old versions of the app state can be brought up-to-date before merging.

When we make a change to the app store which could affect what is stored on disk, we need to create a new migration.


## When do I need to add a state migration?

We are using easy-peasy for persistent local state, which is what a migration is there to help us with.

### Does _not_ require creating a new migration

- Adding, removing or modifying anything which is stored in a `sessionState` object.
- Modifying, adding, or removing a [computed](https://easy-peasy.now.sh/docs/api/computed.html) property, [actions](https://easy-peasy.now.sh/docs/api/action.html) or [thunks](https://easy-peasy.now.sh/docs/api/thunk.html).

### The following kinds of changes to easy-peasy models in the global app store will **always** require a migration

- Adding, removing, renaming, or changing the type of a property from the state Model 

  ```diff
   interface MyModel = {
     existingProperty: string
  +  newProperty: number
     existingAction: action(...)
   }
  ```

- If your changes affect the structure of the persisted version of the app store (found on GlobalStore.js) you need to add a migration.

## How to add a new state migration

1. Open to `migration.ts`.
2. Add a new version in `Versions`. 
    The key should be a descriptive name, and the value should be one higher than the one above.

       ```diff
        const Versions = {
          ...
          SomeMigration: 41,
       +  MyNewlyAddedMigration: 42,
        }
       ```

3. Assign the new `Version` name to `CURRENT_APP_VERSION`.

   ```diff
   -const CURRENT_APP_VERSION = Versions.SomeMigration
   +const CURRENT_APP_VERSION = Versions.MyNewlyAddedMigration
   ```

4. Edit the `migrations` object.

   e.g. to rename a property from `oldName` to `newName`

   ```diff
    const migrations = {
   +   [Versions.RenameOldNameToNewName]: state => {
   +      state.myModule.newName = state.myModule.oldName
   +   }
    }
   ```

5. Test your migration in `migration.tests.ts`.

   ```ts
   describe("App version Versions.RenameOldNameToNewName", () => {
     it("renames `oldName` to `newName`", () => {
       const result = migrate({ state: { version: 0 } })
       expect(result).toMatchObject({
         version: Versions.RenameOldNameToNewName,
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
   describe("App version Versions.RenameOldNameToNewName", () => {
     it("renames `oldName` to `newName` in `arrayOfThings`", () => {
       // This will get you a 'blank' copy of the previous app state version
       const previousState = migrate({ state: { version: 0 }, toVersion: Versions.RenameOldNameToNewName - 1 })
       // saturate it with some data
       previousState.myModule.arrayOfThings = [
         { id: "thing1", oldName: "William" },
         { id: "thing2", oldName: "Siobhan" },
       ]
       // test that the array data was migrated properly
       const result = migrate({ state: previousState })
       expect(result).toMatchObject({
         version: Versions.RenameOldNameToNewName,
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

6. Test your migration manually on a device.
   1. Remove the app from your phone.
   2. Install the latest beta from TestFlight.
   3. Log in and perform actions to accumulate some of the state that will be affected by your changes.
   4. Install your development version of the app from Xcode.
   5. Check that the affected code works as intended.


Don't forget, we're here for you! 
Always feel free to get in touch and ask people for help 🙏
