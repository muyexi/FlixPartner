import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const UserModel = types.model("User").props({
  name: types.maybe(types.string),
  age: types.maybe(types.integer),
})

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
