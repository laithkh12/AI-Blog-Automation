export interface UserType {
  _id?: string;
  name: string;
  username: string;
  role: string;
  email: string;
  password?: string; // Include password for database interactions
  website?: string;
  about?: string;
  createdAt?: string;
}

export interface AuthResponseType {
  user?: Partial<UserType>; // Make all user fields optional, including the password, for flexible usage in client responses
  error?: string;
  loggedIn?: boolean;
}

export interface BlogType {
  _id?: string;
  user?: Partial<UserType>;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  imageUrl?: string;
  published?: boolean;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  likes?: string[];
}

export interface TicketType {
  _id?: string;
  email: string;
  ticketType: string;
  message: string;
  user?: Partial<UserType>;
  status: "open" | "closed";
  createdAt?: string;
  updatedAt?: string;
}
