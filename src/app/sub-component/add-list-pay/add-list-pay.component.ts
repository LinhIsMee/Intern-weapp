import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {Bank} from '../../model/bank.model';
import {BeneficiaryService} from '../../service/pay-and-transfer.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBarErrorComponent} from '../snack-bar-error/snack-bar-error.component';
import {ErrorDeleteComponent} from '../error-delete/error-delete.component';
import {SnackBarComponent} from '../snack-bar/snack-bar.component';
import {CreBeneficaryModel} from '../../model/cre-beneficary.model';


@Component({
  selector: 'app-add-list-pay',
  templateUrl: './add-list-pay.component.html',
  styleUrls: ['./add-list-pay.component.css']
})
export class AddListPayComponent implements OnInit {
  bankName: Bank[] = [];
  hasResults = true;
  accountNumber = '1000000000';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<AddListPayComponent>, private fb: FormBuilder,
              private beneficiaryService: BeneficiaryService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  // form: FormGroup = new FormGroup({});
  inputdata: any;

  form = this.fb.group({
    product: this.fb.control({value: 'Thanh toán & chuyển tiền', disabled: true}),
    transactionType: this.fb.control('Chuyển tiền trong nước', [Validators.required]),
    transactionMethod: this.fb.control('Chuyển qua số tài khoản', [Validators.required]),
    nameOfBank: this.fb.control('', [Validators.required]),
    cardNumber: this.fb.control('', [Validators.required, Validators.maxLength(34)]),
    accountName: this.fb.control({value: '', disabled: true}, [Validators.required]),
    nickname: this.fb.control('')
  });

  ngOnInit(): void {
    this.inputdata = this.data;
    this.loadingBankName();

  }

  // load dữ liệu ngân hàng
  loadingBankName(): void {
    this.beneficiaryService.getBankBeneficiary().subscribe(data => {
      this.bankName = data.banks;
    });
  }
  // lấy dữ liệu ngân hàng hưởng thụ
  getLogo(): string | undefined {
    const selectedBankCode = this.form.get('nameOfBank')?.value;
    return this.bankName.find(bank => bank.code === selectedBankCode)?.logo;
  }

  getBankName(): string | undefined {
    const selectedBankCode = this.form.get('nameOfBank')?.value;
    return this.bankName.find(bank => bank.code === selectedBankCode)?.name;
  }

  getBankCd(): string | undefined {
    const selectedBankCode = this.form.get('nameOfBank')?.value;
    return this.bankName.find(bank => bank.code === selectedBankCode)?.code;
  }

  // tìm kiếm tên ngân hàng theo name || shortname
  // tslint:disable-next-line:typedef
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (filterValue) {
      this.bankName = this.bankName.filter(bank => (bank.name?.toLowerCase().includes(filterValue) ||
        bank.shortname?.toLowerCase().includes(filterValue)));
      this.hasResults = this.bankName.length > 0;
    } else {
      this.loadingBankName();
    }
  }
  // Hàm chọn phương thức chuyển khoản
  // tslint:disable-next-line:typedef
  onMethodChange(event: any) {
    const selectedValue = event.value;
    if (selectedValue === 'Chuyển qua số thẻ') {
      this._snackBar.openFromComponent(SnackBarErrorComponent, {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: {
          messenger: 'Tính năng chưa được hỗ trợ'
        }
      });
      this.form.get('transactionMethod')?.setValue('Chuyển qua số tài khoản');
    }
  }
  // Lấy name người hưởng thụ
  fetchAccountName(): void {
    const bankCd = this.form.get('nameOfBank')?.value;
    const cardNumber = this.form.get('cardNumber')?.value.trim();

    if (bankCd && cardNumber) {
      this.beneficiaryService.getBankAccount(bankCd, cardNumber).subscribe(
        data => {
          if (data.account.bank.code === bankCd && data.account.code === cardNumber) {
            this.form.get('accountName')?.setValue(data.account.name);
          } else {
            this.form.get('accountName')?.setValue('');
            this.showLoadingErrorDialog(data.result.responseCode);
          }
        }, error => {
        this.form.get('accountName')?.setValue('');
        this.showLoadingErrorDialog(error.status);
      }
      );
    }
  }
  // tslint:disable-next-line:typedef
  showLoadingErrorDialog(responseCode: string) {
    this.dialog.open(ErrorDeleteComponent, {
      width: '25%',
      data: {
        title: 'Thông báo lỗi',
        text: 'Không truy vấn được. Vui lòng kiểm tra lại số tài khoản/ngân hàng hưởng thụ',
        subtitle: 'Mã lỗi',
        responseCode,
        close: 'Đóng',
        require: 'Gửi yêu cầu hỗ trợ'
      }
    });
  }
  // tslint:disable-next-line:typedef
  closeup() {
    this.ref.close();
  }
  // Thêm mới người thụ hưởng
  // tslint:disable-next-line:typedef
  saveUser() {
    if (this.form.valid){
      const beneficiaryData: CreBeneficaryModel = {
        accountNumber: this.accountNumber,
        name: this.form.get('accountName')?.value,
        aliasName: this.form.get('nickname')?.value,
        bankCd: this.form.get('nameOfBank')?.value,
        code: this.form.get('cardNumber')?.value,
        transMethod: this.form.get('transactionMethod')?.value,
        typeProduct: this.form.get('product')?.value,
        typeTrans: this.form.get('transactionType')?.value
      };
      this.beneficiaryService.postCreateBeneficiary(beneficiaryData).subscribe( response => {
        console.log(beneficiaryData);
        this._snackBar.openFromComponent(SnackBarComponent, {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          data: {
            messenger: 'Thêm mới thành công. Bản ghi đang chờ phê duyệt'
          }
        });
        this.ref.close();
        this.loadingBankName();
      }, error => {
          this.showSaveErrorDialog(error.status);
        }
      );
    } else {
      this.form.markAllAsTouched();
      this._snackBar.openFromComponent(SnackBarErrorComponent, {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: {
          messenger: 'Vui lòng nhập đầy đủ thông tin'
        }
      });
    }
  }
  // tslint:disable-next-line:typedef
  showSaveErrorDialog(responseCode: string) {
    this.dialog.open(ErrorDeleteComponent, {
      width: '25%',
      data: {
        title: 'Lưu không thành công',
        text: 'Vui lòng kiểm tra lại thông tin!',
        subtitle: 'Mã lỗi',
        responseCode,
        close: 'Đóng',
        require: 'Gửi yêu cầu hỗ trợ'
      }
    });
  }
}
