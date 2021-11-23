import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteComponent } from '../delete/delete.component';
import { Router } from '@angular/router';
import { MatRadioButton } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  public breakpoint: number; // Breakpoint observer code
  public clientname: string =``;
  public fname: string = ``;
  public address: string = ``;
  public contactname: string = ``;
  public email: string = ``;
  public phone: string = ``;
  public interval: number;
  public notes: string = ``;

  public addCusForm: FormGroup;
  wasFormChanged = false;
  
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpClient
  ) { }

  public ngOnInit(): void {
    this.addCusForm = this.fb.group({
      IdProof: null,
      firstname: [this.fname, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      /* lastname: [this.lname, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]], */
      email: [null, [Validators.required, Validators.email]],
      clientname: [this.clientname, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      phone: [this.phone, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      interval: [this.interval, [Validators.required, Validators.pattern("^[0-9]+$")]],
      /* notes: [this.notes, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]], */
      address: [this.address, [Validators.required, Validators.pattern('^[a-zA-Z0-9_ ]*$')]],
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code
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

    if(this.addCusForm.get('firstname').value == "" || this.addCusForm.get('clientname').value == "" || this.addCusForm.get('phone').value == "" || this.addCusForm.get('interval').value == "" || this.addCusForm.get('email').value == "" || this.addCusForm.get('address').value == ""){
      console.log('fname' + this.addCusForm.get('firstname').value)
      console.log('clientname' + this.clientname)
    }
    else{
      this.http.post<any>("https://localhost:44301/api/client/", JSON.stringify({client_name: this.addCusForm.get('clientname').value, Client_Contact_Name: this.addCusForm.get('firstname').value,Client_Contact_Number: this.addCusForm.get('phone').value,Client_Contact_Email: this.addCusForm.get('email').value,Client_Address: this.addCusForm.get('address').value,Client_Intervals: this.addCusForm.get('interval').value}), httpOptions).subscribe(/* data => this.Id = data.id */);
      console.log("Save")
      this.dialog.closeAll();
    }
    setTimeout(
      function(){ 
      location.reload(); 
      }, 1000);

}

    /* closeDialog(){
      if(this.addCusForm.invalid){
        
      }
      else{
        console.log("Save")
      console.log(this.addCusForm)
      this.dialog.closeAll();
      }

    } */

    
}