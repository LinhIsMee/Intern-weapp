import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {BankAccount} from '../../model/list-pay.model';

@Component({
  selector: 'app-dialog-enter',
  templateUrl: './dialog-enter.component.html',
  styleUrls: ['./dialog-enter.component.css']
})
export class DialogEnterComponent implements OnInit{

  approverName = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: BankAccount, private ref: MatDialogRef<DialogEnterComponent>, private fb: FormBuilder) {
  }
  ngOnInit(): void {
  }
  // tslint:disable-next-line:typedef
  confirmUp(){
    this.ref.close(this.approverName);
  }
  // tslint:disable-next-line:typedef
  closeUp() {
    this.ref.close();
  }
}
