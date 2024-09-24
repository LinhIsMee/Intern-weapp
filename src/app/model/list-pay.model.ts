// @ts-ignore
export interface BankAccount {
  id: number;
  accountnumber: string; // số tk nguồn
  bank: string; // ngân hàng thụ hưởng
  bankAccount: {
    id: number;
    bank: {
      id: number;
      code: string; // tên viết tắt ngân hàng thụ hưởng
      name: string; // tên ngân hàng thụ hưởng
      shortname: string; // tên viết tắt ngân hàng thụ hưởng
      logo: string; // logo ngân hàng thụ hưởng
    };
    code: string; // số tk thụ hưởng
    name: string; // tên người thụ hưởng
    role: string; // vai trò
    username: string;
  };
  name: string; // tên người thụ hưởng
  aliasname: string;  // tên gợi nhớ
  typeproduct: string; // loại sản phẩm
  typetrans: string; // Loại giao dịch
  transmethod: string; // phương thức chuyển tiền
  approvedby: string; // người duyệt
}
