import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar-error.component.html',
  styleUrls: ['./snack-bar-error.component.css']
})
export class SnackBarErrorComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, private ref: MatSnackBarRef<SnackBarErrorComponent>) {
  }
  // tslint:disable-next-line:typedef
  closeUp(){
    this.ref.dismiss();
  }
}
