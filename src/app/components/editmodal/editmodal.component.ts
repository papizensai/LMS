import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteComponent } from '../delete/delete.component';
import { Router } from '@angular/router';
import { MatRadioButton } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';

interface Service {
  value: string;
  viewValue: string;
}

let headers = new HttpHeaders({
  'Content-Type':  'application/json',
  'Authorization': `Bearer ${localStorage.getItem("token")}`
});

let options = {headers: headers};

@Component({
  selector: 'app-editmodal',
  templateUrl: './editmodal.component.html',
  styleUrls: ['./editmodal.component.scss']
})
export class EditmodalComponent implements OnInit {
  public breakpoint: number; // Breakpoint observer code
  public clientname: string =``;
  public fname: string = ``;
  public address: string = ``;
  public contactname: string = ``;
  public email: string = ``;
  public phone: string = ``;
  public interval: number;
  public notes: string = ``;
  public service: string ='';
  public clientData;
  public nextservicedate: string = '';

  
  Services: Service[] = [
    {value: 'First Aid', viewValue: 'First Aid'},
    {value: 'AED', viewValue: 'AED'},
    {value: 'Eye Wash', viewValue: 'Eye Wash'},
    {value: 'Oxygen Tanks', viewValue: 'Oxygen Tanks'},
    {value: 'Drop Ship', viewValue: 'Drop Ship'},
  ];

  public addCusForm: FormGroup;
  wasFormChanged = false;

  

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void{
    this.addCusForm = this.fb.group({
      IdProof: null,
      firstname: [this.fname],
      email: [null, [Validators.required, Validators.email]],
      clientname: [this.clientname],
      phone: [this.phone, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      interval: [this.interval, [Validators.required, Validators.pattern("^[0-9]+$")]],
      notes: [this.notes],
      address: [this.address, [Validators.required, Validators.pattern('^[a-zA-Z0-9_ ]*$')]],
      service: [this.service, [Validators.required]],
      nextservicedate: [this.nextservicedate, [Validators.required]],
    });

        
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code 

    this.getCustomer();
        
  }

  public getCustomer() {
    this.http
    .get("https://larsonmedicalapi.azurewebsites.net/api/client/"+this.data.id, options)
    .subscribe(data=>{
      this.clientData = data;
      this.addCusForm.patchValue({
        firstname: this.clientData.client_Contact_Name,
        email: this.clientData.client_Contact_Email,
        clientname: this.clientData.client_Name,
        phone: this.clientData.client_Contact_Number,
        interval: this.clientData.client_Intervals,
        address: this.clientData.client_Address,
        notes: this.clientData.client_Notes,
        service: this.clientData.client_Service,
        nextservicedate: formatDate(this.clientData.client_Next_Service_Date, 'yyyy-MM-dd', this.locale)
      })
    })
  }

  public onAddCus(): void {
    this.markAsDirty(this.addCusForm);
    
  }
  openDialog(): void {
    console.log(this.wasFormChanged);
    if(this.addCusForm.dirty) {
      const dialogRef = this.dialog.open(DeleteComponent, {
        width: '340px',
      });
    } else {
      this.dialog.closeAll();
    }
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    // tslint:disable-next-line:forin
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }

  formChanged() {
    this.wasFormChanged = true;
  }

  closeDialog(params){

    // if(this.addCusForm.get('nextservicedate').value == ""/* ||this.addCusForm.get('firstname').value == "" || this.addCusForm.get('clientname').value == "" || this.addCusForm.get('phone').value == "" || this.addCusForm.get('interval').value == ""|| this.addCusForm.get('nextservicedate').value == ""|| this.addCusForm.get('service').value == "" || this.addCusForm.get('email').value == ""|| this.addCusForm.get('notes').value == "" || this.addCusForm.get('address').value == "" */){
      
    // }
    // else{
      let client = params.data;
      
      this.http.put<any>("https://larsonmedicalapi.azurewebsites.net/api/client/" +this.data.id, JSON.stringify({Client_Name: this.addCusForm.get('clientname').value, Client_Next_Service_Date: this.addCusForm.get('nextservicedate').value, Client_Contact_Name: this.addCusForm.get('firstname').value,Client_Notes: this.addCusForm.get('notes').value,Client_Contact_Number: this.addCusForm.get('phone').value,Client_Contact_Email: this.addCusForm.get('email').value,Client_Address: this.addCusForm.get('address').value,Client_Intervals: this.addCusForm.get('interval').value,Client_Service: this.addCusForm.get('service').value}), options).subscribe(/* data => this.Id = data.id */);
      console.log("Save")
      this.dialog.closeAll();
      setTimeout(
        function(){ 
        location.reload(); 
        }, 1000);
  
    }
  

}