import { Component, OnInit, ViewChild } from "@angular/core";
import { ColDef, Module } from 'ag-grid-community';
import { AgGridAngular } from "ag-grid-angular";
import { catchError, Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModalComponent } from "src/app/components/modal/modal.component";
import { DeleteComponent } from "src/app/components/delete/delete.component";

let headers = new HttpHeaders({
  'Content-Type':  'application/json',
  'Authorization': `Bearer ${localStorage.getItem("token")}`
});

let options = {headers: headers};

function actionCellRenderer(params) {
  let eGui = document.createElement("div");

  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  if (isCurrentRowEditing) {
    eGui.innerHTML = `
<button  class="action-button update"  data-action="Submit"> Submit  </button>
<button  class="action-button cancel"  data-action="cancel" > cancel </button>
`;
  } else {
    eGui.innerHTML = `
<button class="action-button edit"  data-action="Restore" > Restore  </button>

`;
  }

  return eGui;
}

@Component({
  selector: 'app-inactive',
  templateUrl: './inactive.component.html',
  styleUrls: ['./inactive.component.scss']
})
export class InactiveComponent implements OnInit {
  public colDefs;
  public gridApi;
  public gridColumnApi;
  public searchValue;
  public defaultColDef;
  public rowData: [];
  private Id;
  public paginationPageSize;
  public pagination;
  public components;


  constructor(private http: HttpClient, public dialog: MatDialog) { 
    // enables pagination in the grid
    this.pagination = true;

    // sets 10 rows per page (default is 100)
    this.paginationPageSize = 10;
  }

  ngOnInit(): void {
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
        sortable: true,filter: true, resizable: true, /* checkboxSelection: true */ editable:false
      },
      {
        headerName:"Address",
        field:"client_Address",
        sortable: true,filter: true, resizable: true, editable: false
      },
      /* {
        headerName:"Region",
        field:"client_Region",
        sortable: true,filter: true, resizable: true, editable: true
      },
      {
        headerName:"Zip Code",
        field:"client_Zip_Code",
        sortable: true,filter: true, resizable: true, editable: true
      }, */
      {
        headerName:"Contact Name",
        field:"client_Contact_Name",
        sortable: true,filter: true, resizable: true, editable: false
      },
      {
        headerName:"Contact Email",
        field:"client_Contact_Email",
        sortable: true,filter: true, resizable: true, editable: false
      },
      {
        headerName:"Phone Number",
        field:"client_Phone_Number",
        sortable: true,filter: true, resizable: true, editable: false
      },
      {
        headerName:"Active",
        field:"client_Active",
        sortable: true,filter: true, resizable: true, editable: false
      },
      {
        headerName:"Service",
        field:"client_Next_Service_Date",
        sortable: true,filter: true, resizable: true, editable: false,cellEditor: 'datePicker'
      },
      {
        headerName:"Intervals",
        field:"client_Intervals",
        sortable: true,filter: true, resizable: true, editable: false
      },
      
      /* {
        headerName:"Availability",
        field:"client_Availability",
        sortable: true,filter: true, resizable: true, editable: true
      }, */
      {
        headerName:"Notes",
        field:"client_Notes",
        sortable: true,filter: true, resizable: true, editable: true
      },
      
    ]
    this.defaultColDef = {
      editable: true
    };
    /* this.components = { datePicker: getDatePicker() }; */
    this.rowData = null;
  }

  onGridReady(params){
    this.gridApi=params.api;
    this.gridColumnApi=params.columnApi;
    this.http
    .get("https://localhost:44301/api/client/getinactive", options)
    .subscribe(data=>{
      params.api.setRowData(data)
    })

  }
  quickSearch(){
    this.gridApi.setQuickFilter(this.searchValue);
    console.log('test')
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "Restore") {
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

      if (action === "Submit") {
        params.api.stopEditing(false);
        let id = params.data.id;
        params.data.client_Active = true;
        this.http.put<any>("https://localhost:44301/api/client/"+id, params.data, options).subscribe(/* data => this.Id = data.id */);
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
    this.gridApi=params.gridApi;
      this.gridColumnApi=params.columnApi;
      let id = params.data.id;
      this.http.put<any>("https://localhost:44301/api/client/"+id, params.data, options).subscribe(/* data => this.Id = data.id */);
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true,
    });
    setTimeout(
      function(){ 
      location.reload(); 
      }, 1000);
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent,{
      width: '640px',disableClose: true 
      
    });

  }




}


