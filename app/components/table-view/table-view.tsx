import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { DataTable } from "react-native-paper"
import { capitalize, isNumber } from "lodash"

export interface TableViewProps {
  list: any[]
}

export const TableView = observer(function TableView(props: TableViewProps) {
  const { list } = props

  const [sortDescending, setSortDescending] = useState<boolean>(null)
  const [sortKey, setSortKey] = useState<string>(null)

  const sortedList = list.slice().sort((item1, item2) => {
    if (sortKey == null) {
      return 0
    }

    if (sortDescending) {
      return item1[sortKey] < item2[sortKey] ? 1 : -1
    } else {
      return item2[sortKey] < item1[sortKey] ? 1 : -1
    }
  })

  return (
    <DataTable>
      {list.length > 0 && (
        <DataTable.Header key={"header"}>
          {Object.entries(list[0]).map(([key, value]) => (
            <DataTable.Title
              key={key}
              numeric={isNumber(value)}
              sortDirection={sortDescending == false ? "ascending" : "descending"}
              onPress={() => {
                if (sortDescending == null) {
                  setSortDescending(true)
                } else {
                  setSortDescending(!sortDescending)
                }

                setSortKey(key)
              }}
            >
              {capitalize(key)}
            </DataTable.Title>
          ))}
        </DataTable.Header>
      )}

      {sortedList.map((item, index) => (
        <DataTable.Row key={index}>
          {Object.values(item).map((value, index) => (
            <DataTable.Cell key={index} numeric={isNumber(value)}>
              {value}
            </DataTable.Cell>
          ))}
        </DataTable.Row>
      ))}
    </DataTable>
  )
})
