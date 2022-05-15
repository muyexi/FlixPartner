import React, { useEffect, FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Header, TableView } from "../../components"
import { useStores } from "../../models"
import { color, spacing } from "../../theme"

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

export const UserListScreen: FC<StackScreenProps<NavigatorParamList, "userList">> = observer(
  ({ navigation }) => {
    const goBack = () => navigation.goBack()

    const { userStore } = useStores()
    const { users } = userStore

    useEffect(() => {
      async function fetchData() {
        await userStore.getUsers()
      }

      fetchData()
      console.log("users: ", users)
    }, [])

    return (
      <Screen style={ROOT} preset="scroll">
        <Header
          headerTx="userListScreen.title"
          leftIcon="back"
          onLeftPress={goBack}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />

        <TableView list={users} />
      </Screen>
    )
  },
)