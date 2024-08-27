"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  orderColumns,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const firstColumnName = "Index"
  const secColumnName = "Achvz"

  const orderedColumns: ColumnDef<TData, TValue>[] = [
    
    columns.find(col => col.header === firstColumnName) as ColumnDef<TData, TValue> | undefined,
    ...columns.filter(col => col.header !== firstColumnName)
  ].filter((col): col is ColumnDef<TData, TValue> => col !== undefined)



  const table = useReactTable({
    data,
    columns: orderedColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border h-full w-full overflow-y-auto">
      <Table> 
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className={`sticky top-0 ${header.column.id === firstColumnName ? 'left-0 z-20 ' : ''}`}
                  key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                  className={cell.column.id === firstColumnName ? 'sticky left-0 z-10 bg-[hsl(var(--background))] text-center text-[hsl(var(--chart-variant-1))]' : ''}
                  key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-sm">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
      
  )
}
