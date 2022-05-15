import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserModel, UserSnapshot } from "../user/user"
import { ApiClient } from "../../services/api/api-client"
import { withEnvironment } from "../extensions/with-environment"

export const UserStoreModel = types
  .model("UserStore")
  .props({
    users: types.optional(types.array(UserModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveUsers: (snapshots: UserSnapshot[]) => {
      self.users.replace(snapshots)
    },
  }))
  .actions((self) => ({
    getUsers: async () => {
      const users = await ApiClient.fetchUsers()
      self.saveUsers(users)
    },
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserListSnapshot extends UserStoreSnapshotType {}
export const createUserListDefaultModel = () => types.optional(UserStoreModel, {})
