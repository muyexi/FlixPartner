import { ApiClient } from "./../../services/api/api-client"
import { UserStoreModel } from "./user-store"
import users from "../../../assets/users.json"
import moment from "moment"

test("can be created", () => {
  const instance = UserStoreModel.create({})

  expect(instance).toBeTruthy()
})

test("cache expired after 1 hour", async () => {
  const userArray1 = [users[0]]
  const userArray2 = [users[1]]

  let mockStaticF = jest.fn().mockReturnValue(userArray1)
  ApiClient.fetchUsers = mockStaticF
  const store = UserStoreModel.create({})

  // Cache initial response
  await store.getUsers()
  let expired = await store.isCacheExpired()

  expect(store.users).toEqual(userArray1)
  expect(expired).toBe(false)

  jest.useFakeTimers("modern").setSystemTime(
    moment()
      .add(30 * 60, "seconds")
      .valueOf(),
  )

  // Loaded from cache
  await store.getUsers()
  expired = await store.isCacheExpired()

  expect(store.users).toEqual(userArray1)
  expect(expired).toBe(false)

  jest.useFakeTimers("modern").setSystemTime(
    moment()
      .add(30 * 60 + 1, "seconds")
      .valueOf(),
  )

  // Cache expired
  expired = await store.isCacheExpired()
  expect(expired).toBe(true)

  mockStaticF = jest.fn().mockReturnValue(userArray2)
  ApiClient.fetchUsers = mockStaticF

  await store.getUsers()
  expect(store.users).toEqual(userArray2)
})
