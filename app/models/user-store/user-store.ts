import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { values } from "mobx"
import { UserModel, UserSnapshot } from "../user/user"
import { ApiClient } from "../../services/api/api-client"
import { withEnvironment } from "../extensions/with-environment"
import { save, load } from "../../utils/storage"

const moment = require("moment")

export const UserStoreModel = types
  .model("UserStore")
  .props({
    users: types.optional(types.array(UserModel), []),
    query: types.optional(types.string, ""),
  })
  .extend(withEnvironment)
  .views((self) => ({
    get filteredUsers() {
      const users = values(self.users).filter((user) => {
        return user.name.includes(self.query) || user.age.toString().includes(self.query)
      })

      console.log("filteredUsers: ", users)
      return users
    },
    isCacheExpired: async () => {
      const timestamp = await load("UserStoreTime")
      console.log("Timestamp:", timestamp)

      if (timestamp) {
        const secondsAgo = moment().diff(moment.unix(timestamp), "seconds")
        console.log(secondsAgo, "seconds ago")

        return secondsAgo > 60 * 60
      } else {
        return true
      }
    },
  }))
  .actions((self) => ({
    saveUsers: (snapshots: UserSnapshot[]) => {
      self.users.replace(snapshots)
    },
    setQuery(query: string) {
      self.query = query
    },
  }))
  .actions((self) => ({
    getUsers: async () => {
      const expired = await self.isCacheExpired()

      if (expired) {
        const users = await ApiClient.fetchUsers()
        self.saveUsers(users)
        console.log("users: ", users)

        await save("UserStore", users)
        await save("UserStoreTime", moment().unix())

        return users
      } else {
        const users = await load("UserStore")
        self.saveUsers(users)
        console.log("Loaded from cache")

        return users
      }
    },
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserListSnapshot extends UserStoreSnapshotType {}
export const createUserListDefaultModel = () => types.optional(UserStoreModel, {})
