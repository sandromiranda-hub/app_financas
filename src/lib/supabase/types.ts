export type TransactionType = "receita" | "despesa";

export const CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Salário",
  "Freelance",
  "Outros",
] as const;

export type TransactionCategory = (typeof CATEGORIES)[number];

// Ordem fixa (não cíclica) — cada categoria sempre recebe a mesma cor.
export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Alimentação: "var(--chart-1)",
  Transporte: "var(--chart-2)",
  Moradia: "var(--chart-3)",
  Lazer: "var(--chart-4)",
  Saúde: "var(--chart-5)",
  Educação: "var(--chart-6)",
  Outros: "var(--chart-7)",
  Salário: "var(--chart-8)",
  Freelance: "var(--muted-foreground)",
};

export type Transaction = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  transaction_date: string;
  created_at: string;
  updated_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category: TransactionCategory;
  limit_amount: number;
  created_at: string;
  updated_at: string;
};

export type UserAccess = {
  id: string;
  user_id: string;
  expires_at: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type UserAccessOverviewRow = {
  user_id: string;
  email: string | null;
  expires_at: string | null;
  note: string | null;
  dias_restantes: number | null;
};

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at"> & {
          id?: string;
          user_id?: string;
        };
        Update: Partial<
          Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
      budgets: {
        Row: Budget;
        Insert: Omit<Budget, "id" | "user_id" | "created_at" | "updated_at"> & {
          id?: string;
          user_id?: string;
        };
        Update: Partial<
          Omit<Budget, "id" | "user_id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
      user_access: {
        Row: UserAccess;
        Insert: Omit<UserAccess, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<UserAccess, "id" | "user_id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
    };
    Views: {
      user_access_overview: {
        Row: UserAccessOverviewRow;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
};
