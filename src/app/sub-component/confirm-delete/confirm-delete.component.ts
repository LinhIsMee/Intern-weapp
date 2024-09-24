import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<ConfirmDeleteComponent>) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
  }

  // tslint:disable-next-line:typedef
  closeUp() {
    this.ref.close(false);
  }
  // tslint:disable-next-line:typedef
  deleteUp(){
    this.ref.close(true);
  }
}
