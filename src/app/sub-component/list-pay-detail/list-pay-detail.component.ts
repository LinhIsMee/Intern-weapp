import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {BankAccount} from '../../model/list-pay.model';

@Component({
  selector: 'app-list-pay-detail',
  templateUrl: './list-pay-detail.component.html',
  styleUrls: ['./list-pay-detail.component.css']
})
export class ListPayDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: BankAccount, private ref: MatDialogRef<ListPayDetailComponent>) {
  }
  // tslint:disable-next-line:typedef
  closeUp() {
    this.ref.close();
  }

}
