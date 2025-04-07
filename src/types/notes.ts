import { NoteCategory, NoteStatus } from '@prisma/client';

export interface CreateNoteType {
  title: string;
  content: string;
  category?: NoteCategory;
  status?: NoteStatus;
  priority?: number;
  color?: string;
  tags?: string;
  questId?: number;
}

export interface UpdateNoteType {
  title?: string;
  content?: string;
  category?: NoteCategory;
  status?: NoteStatus;
  priority?: number;
  color?: string;
  tags?: string;
  questId?: number | null;
}
