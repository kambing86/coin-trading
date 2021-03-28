import { ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { format } from "date-fns";
import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getOrders } from "store/selectors/order";
import { Order } from "types/order";
import CancelOrderButton from "./CancelOrderButton";

interface Props {
  className?: string;
  name: string;
}

const OrderList = ({ className, name }: Props) => {
  const gridApi = useRef<GridApi | null>(null);
  const gridColumnApi = useRef<ColumnApi | null>(null);

  const [rowData, setRowData] = useState<Order[]>([]);

  const orders = useSelector(getOrders(name));

  useEffect(() => {
    setRowData(orders);
    gridColumnApi.current?.autoSizeAllColumns();
  }, [orders]);

  const onGridReady = (event: GridReadyEvent) => {
    gridApi.current = event.api;
    gridColumnApi.current = event.columnApi;
  };
  const classes = ["ag-theme-alpine"];
  if (className) {
    classes.push(className);
  }

  return (
    <div className={classes.join(" ")}>
      <AgGridReact
        onGridReady={onGridReady}
        rowData={rowData}
        frameworkComponents={{ cancelOrderButton: CancelOrderButton }}
      >
        <AgGridColumn
          field="cancel"
          cellRenderer="cancelOrderButton"
          headerName="Action"
        ></AgGridColumn>
        <AgGridColumn field="status"></AgGridColumn>
        <AgGridColumn field="type"></AgGridColumn>
        <AgGridColumn field="price"></AgGridColumn>
        <AgGridColumn field="actualPrice"></AgGridColumn>
        <AgGridColumn field="quantity"></AgGridColumn>
        <AgGridColumn
          field="createdTime"
          valueFormatter={(params) => {
            const date = params.value as Order["createdTime"];
            return format(date, "yyyy-MM-dd HH:mm:ss");
          }}
        ></AgGridColumn>
        <AgGridColumn
          field="modifiedTime"
          valueFormatter={(params) => {
            const date = params.value as Order["modifiedTime"];
            if (date) {
              return format(date, "yyyy-MM-dd HH:mm:ss");
            }
            return "";
          }}
        ></AgGridColumn>
      </AgGridReact>
    </div>
  );
};

export default memo(OrderList);
