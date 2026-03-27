export interface LessonBuilderMinigame {
  id: string;
  name: string;
  description: string;
}

export interface LessonBuilderMinigameCardProps {
  selectedMinigameName?: string | null;
  onOpenPicker: () => void;
}

export interface MinigamePickerProps {
  isOpen: boolean;
  minigames: LessonBuilderMinigame[];
  selectedMinigameId?: string | null;
  onSelect: (minigameId: string) => void;
  onClose: () => void;
}
