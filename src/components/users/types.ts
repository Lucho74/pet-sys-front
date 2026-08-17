export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface UserFormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}
