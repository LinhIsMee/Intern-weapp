import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {BankAccount} from '../../model/list-pay.model';

@Component({
  selector: 'app-error-delete',
  templateUrl: './error-delete.component.html',
  styleUrls: ['./error-delete.component.css']
})
export class ErrorDeleteComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: BankAccount, private ref: MatDialogRef<ErrorDeleteComponent>, private fb: FormBuilder) {
  }

  inputdata: any;

  ngOnInit(): void {
    this.inputdata = this.data;
  }

  // tslint:disable-next-line:typedef
  closeUp() {
    this.ref.close();
  }
}
