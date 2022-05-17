import React, { useState, Key } from "react"
import { observer } from "mobx-react-lite"
import { DataTable } from "react-native-paper"
import { capitalize, isNumber } from "lodash"

export interface TableViewProps {
  list: any[]
}

export const TableView = observer(function TableView(props: TableViewProps) {
  const { list } = props

  const [sortKey, setSortKey] = useState<string>(null)
  const [sortDescending, setSortDescending] = useState<boolean>(null)
  const [sortedList, setSortedList] = useState<any[]>(null)

  const pageSize = 10
  const totalPageNumber = Math.ceil(list.length / pageSize)
  const [page, setPage] = React.useState<number>(0)

  const pageLabel = () => {
    return `${page * pageSize + 1}-${pageEndIndex()} of ${list.length}`
  }

  const pageEndIndex = () => {
    let endIndex = (page + 1) * pageSize
    const lastPage = totalPageNumber - 1

    if (page === lastPage) {
      endIndex = list.length
    }

    return endIndex
  }

  const sortList = (key: Key) => {
    const isSortDescending = sortDescending == null ? true : !sortDescending
    setSortDescending(isSortDescending)

    const newSortKey = key.toString()
    setSortKey(newSortKey)

    const newList = list.slice().sort((item1, item2) => {
      if (newSortKey == null) {
        return 0
      }

      if (isSortDescending) {
        return item1[newSortKey] < item2[newSortKey] ? 1 : -1
      } else {
        return item2[newSortKey] < item1[newSortKey] ? 1 : -1
      }
    })
    setSortedList(newList)
  }

  const itemsForPage = () => {
    const listToUse = sortKey == null ? list : sortedList
    const startIndex = page * pageSize

    return listToUse.slice(startIndex, pageEndIndex())
  }

  return (
    <DataTable>
      {list.length > 0 && (
        <DataTable.Header key={"header"}>
          {Object.entries(list[0]).map(([key, value]) => (
            <DataTable.Title
              key={key}
              numeric={isNumber(value)}
              sortDirection={sortDescending === false ? "ascending" : "descending"}
              onPress={() => {
                sortList(key)
              }}
            >
              {capitalize(key)}
            </DataTable.Title>
          ))}
        </DataTable.Header>
      )}

      {itemsForPage().map((item, index) => (
        <DataTable.Row key={index}>
          {Object.values(item).map((value, index) => (
            <DataTable.Cell key={index} numeric={isNumber(value)}>
              {value}
            </DataTable.Cell>
          ))}
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={totalPageNumber}
        onPageChange={(page) => setPage(page)}
        label={pageLabel()}
        numberOfItemsPerPage={pageSize}
        showFastPaginationControls={true}
      />
    </DataTable>
  )
})
