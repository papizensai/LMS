import { Component, OnInit } from "@angular/core";
import { ColDef, Module } from 'ag-grid-community';
import { AgGridAngular } from "ag-grid-angular";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";



function actionCellRenderer(params) {
  let eGui = document.createElement("div");

  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  if (isCurrentRowEditing) {
    eGui.innerHTML = `
<button  class="action-button update"  data-action="update"> update  </button>
<button  class="action-button cancel"  data-action="cancel" > cancel </button>
`;
  } else {
    eGui.innerHTML = `
<button class="action-button edit"  data-action="edit" > edit  </button>
<button class="action-button delete" data-action="delete" > delete </button>
`;
  }

  return eGui;
}
/* function actionCellRenderer(params) {
  let eGui = document.createElement("div");

  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  if (isCurrentRowEditing) {
    eGui.innerHTML = `
        <button  
          class="action-button update"
          data-action="update">
               update  
        </button>
        <button  
          class="action-button cancel"
          data-action="cancel">
               cancel
        </button>
        `;
  } else {
    eGui.innerHTML = `
        <button 
          class="action-button edit"  
          data-action="edit">
             edit 
          </button>
        <button 
          class="action-button delete"
          data-action="delete">
             delete
        </button>
        `;
  }

  return eGui;
} */
    
@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html"
})
export class DashboardComponent implements OnInit {
    public colDefs;
    public gridApi;
    public gridColumnApi;
    public searchValue;
    public defaultColDef;
    public rowData: [];
    
  


  constructor(private http: HttpClient) {
    
    
    
  }

  ngOnInit() {
    this.colDefs=[

      {
        headerName: "action",
        minWidth: 150,
        cellRenderer: actionCellRenderer,
        editable: false,
        colId: "action"
      },
      {
        headerName:"Client Name",
        field:"client_Name",
        sortable: true,filter: true, resizable: true, checkboxSelection: true, /* editable:true */
      },
      {
        headerName:"Client Address",
        field:"client_Address",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Client Region",
        field:"client_Region",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Client Zip Code",
        field:"client_Zip_Code",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Client Contact Name",
        field:"client_Contact_Name",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Client Contact Email",
        field:"client_Contact_Email",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Client Phone Number",
        field:"clieclient_Phone_Numbernt_Name",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Client Active",
        field:"client_Active",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Client Service",
        field:"client_Service",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Client Intervals",
        field:"client_Intervals",
        sortable: true,filter: true, resizable: true, editable: true
      },
      
      {
        headerName:"Client Availability",
        field:"client_Availability",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Client Notes",
        field:"client_Notes",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Category",
        field:"CategoryID",
        sortable: true,filter: true, resizable: true, editable: true
      }

      
    ]
    this.defaultColDef = {
      editable: true
    };
    this.rowData = null;

  }
  onGridReady(params){
    this.gridApi=params.api;
    this.gridColumnApi=params.columnApi;
    this.http
    .get("https://localhost:44301/api/client")
    .subscribe(data=>{
      params.api.setRowData(data)
    })

  }
  quickSearch(){
    this.gridApi.setQuickFilter(this.searchValue);
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "edit") {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
      }

      if (action === "update") {
        params.api.stopEditing(false);
      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
    }
  }

  onRowEditingStarted(params) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }
  onRowEditingStopped(params) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }
}
  

