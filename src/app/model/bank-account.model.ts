export interface IBankAccount {
  id: number;
  bank: {
    id: number;
    code: string; // mã ngân hàng
    name: string; // tên ngân hàng
    shortname: string;
    logo: string;
  };
  code: string; // số tài khoản
  name: string; // tên chủ tài khoản
  role: string;
  username: string;
}
