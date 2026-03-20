export type CharacterType =
  | 'orbit'
  | 'spark'
  | 'petal'
  | 'focus'
  | 'leaf'
  | 'bounce'

export type StudentCharacterOption = {
  id: CharacterType
  label: string
}
