export interface NewsletterEmail {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Newsletter {
  id: string;
  createdAt: Date;
  content: string;
}
