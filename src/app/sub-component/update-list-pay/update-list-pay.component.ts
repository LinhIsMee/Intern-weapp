import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BankAccount} from '../../model/list-pay.model';
import {BeneficiaryService} from '../../service/pay-and-transfer.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-update-list-pay',
  templateUrl: './update-list-pay.component.html',
  styleUrls: ['./update-list-pay.component.css']
})
export class UpdateListPayComponent implements OnInit {
  beneficiaryForm: FormGroup = new FormGroup({});
  updateSuccess$ = new Subject<string>();

  // tslint:disable-next-line:max-line-length
  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<UpdateListPayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BankAccount
  ) {
    this.beneficiaryForm = this.fb.group({
      nickname: [data.aliasname || '']
    });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
  }

  // tslint:disable-next-line:typedef
  onSubmit() {
    if (this.beneficiaryForm.valid) {
      const updatedAliasName = this.beneficiaryForm.get('nickname')?.value;
      this.updateSuccess$.next(updatedAliasName);
    }
  }

  // tslint:disable-next-line:typedef
  closeUp() {
    this.ref.close();
  }

}
