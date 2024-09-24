import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {BankAccount} from '../../model/list-pay.model';

@Component({
  selector: 'app-dialog-textarea',
  templateUrl: './dialog-textarea.component.html',
  styleUrls: ['./dialog-textarea.component.css']
})
export class DialogTextareaComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: BankAccount, private ref: MatDialogRef<DialogTextareaComponent>, private fb: FormBuilder) {
  }
  ngOnInit(): void {
  }
  // tslint:disable-next-line:typedef
  deleteUp(){
    this.ref.close(true);
  }
  // tslint:disable-next-line:typedef
  closeUp() {
    this.ref.close();
  }
}
