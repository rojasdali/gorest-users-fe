export interface User {
  id: number;
  name: string;
  email: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive';
}

export interface UserResponse {
  data: User[];
  meta: {
    pagination: {
      total: number;
      pages: number;
      page: number;
      limit: number;
    };
  };
}
