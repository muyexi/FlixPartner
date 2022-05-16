import users from "../../../assets/users.json"

export type User = {
  readonly name: string
  readonly age: number
}

export class ApiClient {
  static readonly users: User[] = users

  public static async fetchUsers(): Promise<User[]> {
    return Promise.resolve(ApiClient.users)
  }
}
