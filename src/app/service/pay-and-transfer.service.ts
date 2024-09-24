import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable } from 'rxjs';
import {BankAccount} from '../model/list-pay.model';
import {environment} from '../../environments/environment';
import {Bank} from '../model/bank.model';
import {IBankAccount} from '../model/bank-account.model';
import {CreBeneficaryModel} from '../model/cre-beneficary.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'Application/json', 'ngrok-skip-browser-warning': 'ok'})
};

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  private apiUrl = environment.apiUrl;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(private http: HttpClient) {
  }

  // MAKER
  // API hiển thị danh sách bảng
  getBeneficiary(accountNumber: string, page: number, limit: number): Observable<{ beneficiaries: BankAccount[], totalPages: number }> {
    return this.http.get<{
      beneficiaries: BankAccount[],
      totalPages: number
    }>(`${this.apiUrl}/benname?accountNumber=${accountNumber}&page=${page}&limit=${limit}`, httpOptions);
  }

  deleteBeneficiary(id: number): Observable<{ beneficiaries: BankAccount[] }> {
    return this.http.delete<{ beneficiaries: BankAccount[] }>(`${this.apiUrl}/benname/detail/${id}`, httpOptions);
  }

  // API lấy danh sách chi tiết người thụ hưởng
  getDetailBeneficiary(id: number): Observable<{ beneficiaries: BankAccount[] }> {
    return this.http.get<{ beneficiaries: BankAccount[] }>(`${this.apiUrl}/benname/detail/${id}`, httpOptions);
  }

  // API lấy put tên gợi nhớ người thụ hưởng
  putAliasBeneficiary(id: number, aliasname: string): Observable<{ beneficiaries: BankAccount[] }> {
    return this.http.put<{ beneficiaries: BankAccount[] }>(`${this.apiUrl}/benname/detail/${id}`, {aliasname}, httpOptions);
  }

  // Api search theo ten hoac theo so tai khoan
  // tslint:disable-next-line:max-line-length
  searchBeneficiary(accountNumber: string, input: string, page: number, limit: number): Observable<{ beneficiaries: BankAccount[], totalPages: number }> {
    return this.http.get<{
      beneficiaries: BankAccount[],
      totalPages: number
    }>(`${this.apiUrl}/benname/search?accountNumber=${accountNumber}&input=${input}&page=${page}&limit=${limit}`, httpOptions);
  }

  // API danh sách các ngân hàng
  getBankBeneficiary(): Observable<{ banks: Bank[] }> {
    return this.http.get<{ banks: Bank[] }>(`${this.apiUrl}/bank/list`);
  }

  // API tài khoản ngân hàng
  getBankAccount(bankCode: number, accountNumber: string): Observable<{
    account: IBankAccount;
    result: { responseCode: string };
  }> {
    return this.http.get<{
      account: IBankAccount;
      result: { responseCode: string };
    }>(`${this.apiUrl}/bank/account?bankCode=${bankCode}&accountNumber=${accountNumber}`);
  }
  // API thêm người thụ hưởng
  postCreateBeneficiary(beneficiaryData: CreBeneficaryModel): Observable<{ beneficiaries: BankAccount[] }> {
    return this.http.post<({ beneficiaries: BankAccount[] })>(`${this.apiUrl}/benname/save`, beneficiaryData, httpOptions);
  }

  // CHECKER
  // API lấy danh sách cần duyệt
  getCheckBeneficiary(page: number, limit: number): Observable<{ beneficiaries: BankAccount[], totalPages: number }> {
    return this.http.get<{
      beneficiaries: BankAccount[],
      totalPages: number
    }>(`${this.apiUrl}/benname/check?page=${page}&limit=${limit}`, httpOptions);
  }
  // API từ chối
  rejectBeneficiary(id: number): Observable<{ beneficiaries: BankAccount[] }> {
    return this.http.delete<{ beneficiaries: BankAccount[] }>(`${this.apiUrl}/benname/${id}/reject`, httpOptions);
  }
  // API duyêt
  confirmBeneficiary(id: number, name: string): Observable<{ beneficiaries: BankAccount[] }> {
    return this.http.put<{ beneficiaries: BankAccount[] }>(`${this.apiUrl}/benname/${id}/confirm`, {name} , httpOptions);
  }
}
