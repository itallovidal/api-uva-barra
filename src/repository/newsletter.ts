import type { Newsletter } from "@/types/newsletter/entities";

export interface NewsletterRepository {
  findAll(): Promise<Newsletter[]>;
  findById(id: string): Promise<Newsletter | null>;
  create(input: Newsletter): Promise<Newsletter>;
  update(id: string, input: Partial<Newsletter>): Promise<Newsletter | null>;
  delete(id: string): Promise<boolean>;
}
