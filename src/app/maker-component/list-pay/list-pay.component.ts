import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddListPayComponent} from '../../sub-component/add-list-pay/add-list-pay.component';
import {ConfirmDeleteComponent} from '../../sub-component/confirm-delete/confirm-delete.component';
import {UpdateListPayComponent} from '../../sub-component/update-list-pay/update-list-pay.component';
import {SelectionModel} from '@angular/cdk/collections';
import {ListPayDetailComponent} from '../../sub-component/list-pay-detail/list-pay-detail.component';
import {BeneficiaryService} from '../../service/pay-and-transfer.service';
import {BankAccount} from '../../model/list-pay.model';
import {catchError, concatMap, max, takeUntil, tap} from 'rxjs/operators';
import {from, throwError} from 'rxjs';
import {ErrorDeleteComponent} from '../../sub-component/error-delete/error-delete.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBarComponent} from '../../sub-component/snack-bar/snack-bar.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';


@Component({
  selector: 'app-list-pay',
  templateUrl: './list-pay.component.html',
  styleUrls: ['./list-pay.component.css'],
})
export class ListPayComponent implements OnInit, AfterViewInit {

  constructor(private dialog: MatDialog, private beneficiaryService: BeneficiaryService, private _snackBar: MatSnackBar) {
  }

  displayedColumns: string[] = ['select', 'logo', 'bankName', 'cardOwnerName', 'cardNumber', 'action', 'status'];
  dataSource = new MatTableDataSource<BankAccount>();
  selection = new SelectionModel<BankAccount>(true, []);
  detailBeneficiary: BankAccount[] = [];

  searchQuery = '';
  hasResults = true;
  showFilter = false;
  apiSuccess = true;
  accountNumber = '1000000002' +
    '';
  pageSize = 5;
  pageIndex = 0;
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
    this.fetchBeneficiary();
  }
  // LOAD DU LIEU TABLE
  // tslint:disable-next-line:typedef
  fetchBeneficiary() {
    this.beneficiaryService.getBeneficiary(this.accountNumber, this.pageIndex , this.pageSize).pipe(
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
  // Phân trang
  // tslint:disable-next-line:typedef
  onChangePage(page: number) {
    this.pageIndex = page - 1;
    this.fetchBeneficiary();
  }
  // BO LOC THEO LOAI GIAO DICH
  // tslint:disable-next-line:typedef
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  // tslint:disable-next-line:typedef
  validateSearchQuery(value: string) {
    const regex = /^[A-Z0-9+\-:().?^'/&%=\u20AC\u00A3$]*$/;
    if (!regex.test(value)) {
      this.searchQuery = value.replace(/[^A-Z0-9+\-:().?^'/&%=\u20AC\u00A3$]/g, '');
    } else {
      this.searchQuery = value;
    }
  }

  // SEARCH THEO SO TAI KHOAN HOẠC TEN NGUOI THU HUONG
  // tslint:disable-next-line:typedef
  searchBeneficiary() {
    this.beneficiaryService.searchBeneficiary(this.accountNumber, this.searchQuery, this.pageIndex, this.pageSize).pipe(
      catchError((error) => {
        this.hasResults = false;
        console.error('Search API Error: ', error);
        return throwError('');
      })
    ).subscribe(data => {
      this.dataSource.data = data.beneficiaries;
      this.totalPages = data.totalPages;
      this.hasResults = this.dataSource.data.length > 0;
      console.log('list of bank account', this.dataSource.data);
    });
  }

  // CHINH SUA TEN GOI NHO
  // tslint:disable-next-line:typedef
  updateShow(bankAccount: BankAccount) {
    const id = bankAccount.id;
    const updateDialog = this.dialog.open(UpdateListPayComponent, {
      width: '45%',
      data: {
        ...bankAccount
      }
    });
    // tslint:disable-next-line:no-shadowed-variable
    // todo: afterClosed chỉ dành để lắng nghe khi người dùng đóng popup
    // tạo 1 biến observable để bắn dữ liệu từ popup về component mở popup khi nhấn nút cập nhật
    // khi api trả về kết quả thành công thì mới được đóng popup
    updateDialog.componentInstance.updateSuccess$.pipe(tap(updatedAliasName => {
        if (updatedAliasName !== undefined) {
          bankAccount.aliasname = updatedAliasName;
          this.beneficiaryService.putAliasBeneficiary(id, updatedAliasName).pipe(
            catchError((error) => {
              console.error('Update API error: ', error);
              this.openErrorUpdate(error.error.result.responseCode);
              return throwError('');
            })
          ).subscribe(() => {
            updateDialog.close();
            this._snackBar.openFromComponent(SnackBarComponent, {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              data: {
                messenger: 'Cập nhật thành công'
              }
            });
            this.fetchBeneficiary();
          });
        }
      }),
      takeUntil(updateDialog.afterClosed())
    ).subscribe();
  }

  // tslint:disable-next-line:typedef
  openErrorUpdate(responseCode: string) {
    this.dialog.open(ErrorDeleteComponent, {
      width: '25%',
      data: {
        title: 'Thông báo lỗi',
        text: 'Cập nhật tên gợi nhớ không thành công',
        subtitle: 'Mã lỗi',
        responseCode,
        close: 'Đóng',
        require: 'Gửi yêu cầu hỗ trợ'
      }
    });
  }

  // XOA NGUOI THU HUONG
  // tslint:disable-next-line:typedef no-shadowed-variable
  deleteShow(element: BankAccount) {
    // tslint:disable-next-line:prefer-const variable-name
    let _deleteUp = this.dialog.open(ConfirmDeleteComponent, {
      width: '25%',
      data: {
        title: 'Xóa người thụ hưởng',
        question: 'Bạn có chắc chắn muốn xóa người thụ hưởng?',
        delete: 'Xóa',
        id: element.id
      }
    });
    _deleteUp.afterClosed().subscribe(item => {
      if (item) {
        this.deleteBeneficiaries(element.id);
      }
    });
  }

  // tslint:disable-next-line:typedef
  deleteBeneficiaries(id: number) {
    this.beneficiaryService.deleteBeneficiary(id).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      catchError((error) => {
        console.error('Delete API error: ', error);
        this.openErrorDelete(error.error.result.responseCode);
        return throwError('');
      })
    ).subscribe(() => {
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: {
          messenger: 'Xóa thành công'
        }
      });
      this.fetchBeneficiary();
    });
  }

  // tslint:disable-next-line:typedef
  openErrorDelete(responseCode: string) {
    this.dialog.open(ErrorDeleteComponent, {
      width: '25%',
      data: {
        title: 'Thông báo lỗi',
        text: 'Xóa người thụ hưởng không thành công',
        subtitle: 'Mã lỗi',
        responseCode,
        close: 'Đóng',
        require: 'Gửi yêu cầu hỗ trợ'
      }
    });
  }

  // DELETE XOA NHIEU NGUOI
  // tslint:disable-next-line:typedef
  deleteSelected() {
    const itemList = this.selection.selected.map(item => item.id);
    if (itemList.length === 0) {
      return;
    }
    const _deleteUp = this.dialog.open(ConfirmDeleteComponent, {
      width: '25%',
      data: {
        title: 'Xóa người thụ hưởng',
        question: 'Bạn có chắc chắn muốn xóa người thụ hưởng?',
        delete: 'Xóa',
        id: itemList
      }
    });
    _deleteUp.afterClosed().subscribe(item => {
      if (item) {
        this.deleteSelectedBeneficiaries(itemList);
      }
    });
  }

  // tslint:disable-next-line:typedef
  deleteSelectedBeneficiaries(ids: number[]) {
    from(ids).pipe(
      concatMap(id =>
        this.beneficiaryService.deleteBeneficiary(id).pipe(
          // tslint:disable-next-line:no-shadowed-variable
          catchError((error) => {
            console.error('Delete API error: ', error);
            this.openErrorDelete(error.error.result.responseCode);
            return throwError('');
          })
        )
      )
    ).subscribe(() => {
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: {
          messenger: 'Xóa thành công'
        }
      });
      this.fetchBeneficiary();
      this.selection.clear();
    });
  }

  // THEM NGUOI THU HUONG
  // tslint:disable-next-line:typedef
  openAdd() {
    // tslint:disable-next-line:prefer-const variable-name
    let _popUp = this.dialog.open(AddListPayComponent, {
      width: '45%',
      height: 'auto',
      data: {
        title: 'Thêm mới người thụ thưởng',
        product: 'Loại sản phẩm',
        transaction: 'Loại giao dịch',
        method: 'Phương thức chuyển tiền',
        name: 'Tên ngân hàng thủ hưởng',
        account: 'Số tài khoản',
        username: 'Tên chủ tài khoản',
        evocative: 'Tên gợi nhớ',
        icon: '*'
      }
    });
    _popUp.afterClosed().subscribe(item => {
      if (item){
        console.log(item);
      }
    });
  }

  // HIEN THI CHI TIET NGUOI THU HUONG
  // tslint:disable-next-line:typedef
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // tslint:disable-next-line:typedef
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: BankAccount): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.bankAccount.name}`;
  }
}
