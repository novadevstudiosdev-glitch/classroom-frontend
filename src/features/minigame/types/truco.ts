export type CantoType = "envido" | "real-envido" | "falta-envido" | "truco";

export interface Canto {
  type: CantoType;
  word: string;
  who: string;
}
