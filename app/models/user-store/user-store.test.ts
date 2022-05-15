import { ApiClient } from "./../../services/api/api-client"
import { UserStoreModel } from "./user-store"

const moment = require("moment")

const USER_ARRAY1 = [
  {
    name: "Matthew",
    age: 20,
  },
]

const USER_ARRAY2 = [
  {
    name: "Alexander",
    age: 25,
  },
]

test("can be created", () => {
  const instance = UserStoreModel.create({})

  expect(instance).toBeTruthy()
})

test("cache expired after 1 hour", async () => {
  var mockStaticF = jest.fn().mockReturnValue(USER_ARRAY1)
  ApiClient.fetchUsers = mockStaticF
  const store = UserStoreModel.create({})

  // Cache initial response
  await store.getUsers()
  var expired = await store.isCacheExpired()

  expect(store.users).toEqual(USER_ARRAY1)
  expect(expired).toBe(false)

  jest.useFakeTimers("modern").setSystemTime(
    moment()
      .add(30 * 60, "seconds")
      .valueOf(),
  )

  // Loaded from cache
  await store.getUsers()
  expired = await store.isCacheExpired()

  expect(store.users).toEqual(USER_ARRAY1)
  expect(expired).toBe(false)

  jest.useFakeTimers("modern").setSystemTime(
    moment()
      .add(30 * 60 + 1, "seconds")
      .valueOf(),
  )

  // Cache expired
  expired = await store.isCacheExpired()
  expect(expired).toBe(true)

  mockStaticF = jest.fn().mockReturnValue(USER_ARRAY2)
  ApiClient.fetchUsers = mockStaticF

  await store.getUsers()
  expect(store.users).toEqual(USER_ARRAY2)
})
