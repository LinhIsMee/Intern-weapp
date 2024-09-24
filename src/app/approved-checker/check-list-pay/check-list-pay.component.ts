import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDeleteComponent} from '../../sub-component/confirm-delete/confirm-delete.component';
import {ListPayDetailComponent} from '../../sub-component/list-pay-detail/list-pay-detail.component';
import {BeneficiaryService} from '../../service/pay-and-transfer.service';
import {BankAccount} from '../../model/list-pay.model';
import {catchError, concatMap, max} from 'rxjs/operators';
import {from, throwError} from 'rxjs';
import {ErrorDeleteComponent} from '../../sub-component/error-delete/error-delete.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBarComponent} from '../../sub-component/snack-bar/snack-bar.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {DialogTextareaComponent} from '../../sub-component/dialog-textarea/dialog-textarea.component';
import {DialogEnterComponent} from '../../sub-component/dialog-enter/dialog-enter.component';
import {error} from 'protractor';
import {SnackBarErrorComponent} from '../../sub-component/snack-bar-error/snack-bar-error.component';


@Component({
  selector: 'app-check-list-pay',
  templateUrl: './check-list-pay.component.html',
  styleUrls: ['./check-list-pay.component.css'],
})
export class CheckListPayComponent implements OnInit, AfterViewInit {

  constructor(private dialog: MatDialog, private beneficiaryService: BeneficiaryService, private _snackBar: MatSnackBar) {
  }

  // listBeneficiary: BankAccount[] = [];
  displayedColumns: string[] = ['logo', 'bankName', 'cardOwnerName', 'cardNumber', 'action'];
  dataSource = new MatTableDataSource<BankAccount>();
  detailBeneficiary: BankAccount[] = [];
  hasResults = true;
  apiSuccess = true;
  pageSize = 5;
  pageIndex = 1;
  totalPages = 0;
  Math = Math;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  protected readonly length = length;

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.fetchCheckBeneficiary();
  }

  // LOAD DU LIEU TABLE
  // tslint:disable-next-line:typedef
  fetchCheckBeneficiary() {
    this.beneficiaryService.getCheckBeneficiary( this.pageIndex - 1, this.pageSize).pipe(
      catchError((error) => {
        console.error('Get API Error: ', error);
        this.apiSuccess = false;
        return throwError('');
      })
    ).subscribe(data => {
      this.dataSource.data = data.beneficiaries;
      this.totalPages = data.totalPages;
      this.hasResults = this.dataSource.data.length > 0;
      console.log('list of bank account', this.dataSource);
    });
  }

  // tslint:disable-next-line:typedef
  onChangePage(page: number) {
    this.pageIndex = page - 1;
    this.fetchCheckBeneficiary();
  }
  detailShow(bankAccount: BankAccount) {
    const id = bankAccount.id;
    this.beneficiaryService.getDetailBeneficiary(id).subscribe(data => {
      this.detailBeneficiary = data.beneficiaries;
      const detailDialog = this.dialog.open(ListPayDetailComponent, {
        width: '45%',
        data: this.detailBeneficiary[0]
      });
      detailDialog.afterClosed().subscribe(() => {
        this.detailBeneficiary = [];
      });
    });
  }
  // tslint:disable-next-line:typedef
  rejectShow(element: BankAccount) {
    // tslint:disable-next-line:prefer-const variable-name
    let _deleteUp = this.dialog.open(DialogTextareaComponent, {
      width: '25%',
      data: {
        delete: 'Từ chối',
        id: element.id}
    });
    _deleteUp.afterClosed().subscribe(item => {
      if (item) {
        this.rejectBeneficiaries(element.id);
      }
    });
  }

  // tslint:disable-next-line:typedef
  rejectBeneficiaries(id: number) {
    this.beneficiaryService.rejectBeneficiary(id).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      catchError((error) => {
        console.error('Reject API error: ', error);
        this.openErrorReject(error.error.result.responseCode);
        return throwError('');
      })
    ).subscribe(() => {
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: {
          messenger: 'Từ chối thành công'
        }
      });
      this.fetchCheckBeneficiary();
    });
  }
  // tslint:disable-next-line:typedef
  openErrorReject(responseCode: string) {
    this.dialog.open(ErrorDeleteComponent, {
      width: '25%',
      data: {
        title: 'Thông báo lỗi',
        text: 'Từ chối không thành công',
        subtitle: 'Mã lỗi',
        responseCode,
        close: 'Đóng',
        require: 'Gửi yêu cầu hỗ trợ'
      }
    });
  }
  // tslint:disable-next-line:typedef
  approvedShow(element: BankAccount) {
    // tslint:disable-next-line:prefer-const variable-name
    const confirmDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '25%',
      data: {
        title: 'Xác nhận duyệt',
        question: 'Bạn chắc chắn muốn duyệt bản ghi này?',
        delete: 'Đồng ý'}
    });
    confirmDialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const nameDialogRef = this.dialog.open(DialogEnterComponent, {
          width: '25%'
        });
        nameDialogRef.afterClosed().subscribe(approverName => {
          if (approverName) {
            this.confirmBeneficiary(element.id, approverName);
          }
        });
      }
    });
  }
  // tslint:disable-next-line:typedef
  confirmBeneficiary(id: number, approverName: string) {
    this.beneficiaryService.confirmBeneficiary(id, approverName).subscribe( response => {
      this.dataSource.data = response.beneficiaries;
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: {
          messenger: 'Duyệt thành công'
        }
      });
      this.fetchCheckBeneficiary();
    }, error => {
        console.error('Add API error: ', error);
        this._snackBar.openFromComponent(SnackBarErrorComponent, {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          data: {
            messenger: 'Duyệt không thành công'
          }
        });
      }
    );
  }
}
