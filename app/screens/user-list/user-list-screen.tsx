import React, { useEffect, useState, useCallback, FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Header, TableView } from "../../components"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { TextInput } from "react-native-paper"
import { debounce } from "lodash"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
}

const HEADER: TextStyle = {
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: spacing[4],
  paddingTop: spacing[3],
}
const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: "bold",
  color: color.palette.black,
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: "center",
}

export const UserListScreen: FC<StackScreenProps<NavigatorParamList, "userList">> = observer(() => {
  const { userStore } = useStores()
  const { users, filteredUsers } = userStore

  const [text, setText] = useState<string>("")

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    await userStore.getUsers()
  }

  const debouncedFilter = useCallback(
    debounce((query) => {
      userStore.setQuery(query)
      console.log("search: ", query)
    }, 500),
    [],
  )

  return (
    <Screen style={ROOT} preset="scroll">
      <Header
        headerTx="userListScreen.title"
        rightIcon="refresh"
        onRightPress={fetchData}
        style={HEADER}
        titleStyle={HEADER_TITLE}
      />
      <TextInput
        label="Search"
        value={text}
        dense={true}
        clearButtonMode="always"
        clearTextOnFocus={true}
        autoComplete={false}
        onChangeText={(text) => {
          setText(text)
          debouncedFilter(text)
        }}
      />

      <TableView list={text == "" ? users : filteredUsers} />
    </Screen>
  )
})
