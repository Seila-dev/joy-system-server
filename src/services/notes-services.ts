import { PrismaClient, Note, NoteCategory, NoteStatus } from '@prisma/client';
import { CreateNoteType, UpdateNoteType } from '../types/notes';

const prisma = new PrismaClient();

export class NoteService {
  async createNote(userId: number, data: CreateNoteType): Promise<Note> {
    const parsedData = {
        ...data,
        priority: data.priority !== undefined ?
        (typeof data.priority === 'string' ? parseInt(data.priority, 10) : data.priority) : 0
    }
    return prisma.note.create({
      data: {
        ...parsedData,
        userId
      }
    });
  }

  async getNotes(userId: number): Promise<Note[]> {
    return prisma.note.findMany({
      where: {
        userId
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { updatedAt: 'desc' }
      ]
    });
  }

  async getNoteById(id: number, userId: number): Promise<Note | null> {
    return prisma.note.findFirst({
      where: {
        id,
        userId
      }
    });
  }

  async updateNote(id: number, userId: number, data: UpdateNoteType): Promise<Note | null> {
    const note = await prisma.note.findFirst({
      where: { id, userId }
    });

    if (!note) return null;

    const parsedData = {
        ...data,
        priority: data.priority !== undefined ? 
          (typeof data.priority === 'string' ? parseInt(data.priority, 10) : data.priority) : 
          note.priority 
      };

    return prisma.note.update({
      where: { id },
      data: parsedData
    });
  }

  async deleteNote(id: number, userId: number): Promise<boolean> {
    const note = await prisma.note.findFirst({
      where: { id, userId }
    });

    if (!note) return false;

    await prisma.note.delete({
      where: { id }
    });
    
    return true;
  }

  async getNotesByCategory(userId: number, category: NoteCategory): Promise<Note[]> {
    return prisma.note.findMany({
      where: {
        userId,
        category
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }
  
  async getNotesByStatus(userId: number, status: NoteStatus): Promise<Note[]> {
    return prisma.note.findMany({
      where: {
        userId,
        status
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  async searchNotes(userId: number, searchTerm: string): Promise<Note[]> {
    return prisma.note.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
        ]
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }
}
