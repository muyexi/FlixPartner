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
import { StatusBar } from "react-native"
import { ActivityIndicator, Colors } from "react-native-paper"

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

const LOADING: ViewStyle = {
  paddingBottom: spacing[3],
  paddingTop: spacing[3],
}

export const UserListScreen: FC<StackScreenProps<NavigatorParamList, "userList">> = observer(() => {
  const { userStore } = useStores()
  const { users, filteredUsers } = userStore

  const [text, setText] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    userStore.getUsers().then((users) => {
      setTimeout(() => setLoading(false), 1500)
    })
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
      <StatusBar backgroundColor="blue" barStyle="dark-content" />
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

      {loading && <ActivityIndicator animating={true} color={Colors.red800} style={LOADING} />}
      <TableView list={text == "" ? users : filteredUsers} />
    </Screen>
  )
})
