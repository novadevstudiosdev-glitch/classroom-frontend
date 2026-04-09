export type CantoType = "envido" | "truco" | "falta";

export interface Canto {
  type: CantoType;
  word: string;
  who: string;
}
