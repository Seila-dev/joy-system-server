import { Request, Response } from 'express';
import { NoteService } from '../../services/notes-services';
import { NoteCategory, NoteStatus } from '@prisma/client';

const noteService = new NoteService();

export class NoteController {
  async createNote(req: Request, res: Response){
    try {
      const userId = req.user.id
      const note = await noteService.createNote(userId, req.body);
      res.status(201).json(note);
    } catch (error) {
      console.error('Erro ao criar nota:', error);
      res.status(500).json({ error: 'Erro ao criar nota' });
    }
  }

  async getNotes(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const notes = await noteService.getNotes(userId);
      res.status(200).json(notes);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
    res.status(500).json({ error: 'Erro ao buscar notas' });
    }
  }

  async getNoteById(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const noteId = parseInt(req.params.id);
      
      const note = await noteService.getNoteById(noteId, userId);
      
      if (!note) {
        res.status(404).json({ error: 'Nota não encontrada' });
        return
      }
      
      res.status(200).json(note);
    } catch (error) {
      console.error('Erro ao buscar nota:', error);
      res.status(500).json({ error: 'Erro ao buscar nota' });
    }
  }

  async updateNote(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const noteId = parseInt(req.params.id);
      
      const updatedNote = await noteService.updateNote(noteId, userId, req.body);
      
      if (!updatedNote) {
        res.status(404).json({ error: 'Nota não encontrada ou você não tem permissão para editá-la' });
        return
      }
      
      res.status(200).json(updatedNote);
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      res.status(500).json({ error: 'Erro ao atualizar nota' });
    }
  }

  async deleteNote(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const noteId = parseInt(req.params.id);
      
      const result = await noteService.deleteNote(noteId, userId);
      
      if (!result) {
        res.status(404).json({ error: 'Nota não encontrada ou você não tem permissão para excluí-la' });
        return
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      res.status(500).json({ error: 'Erro ao excluir nota' });
    }
  }

  async getNotesByCategory(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const category = req.params.category as NoteCategory;
      
      const notes = await noteService.getNotesByCategory(userId, category);
      res.status(200).json(notes);
    } catch (error) {
      console.error('Erro ao buscar notas por categoria:', error);
      res.status(500).json({ error: 'Erro ao buscar notas por categoria' });
    }
  }

  async getNotesByStatus(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const status = req.params.status as NoteStatus;
      
      const notes = await noteService.getNotesByStatus(userId, status);
      res.status(200).json(notes);
    } catch (error) {
      console.error('Erro ao buscar notas por status:', error);
      res.status(500).json({ error: 'Erro ao buscar notas por status' });
    }
  }

  async searchNotes(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const searchTerm = req.query.q as string;
      
      if (!searchTerm) {
        res.status(400).json({ error: 'Termo de busca não fornecido' });
      }
      
      const notes = await noteService.searchNotes(userId, searchTerm);
      res.status(200).json(notes);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      res.status(500).json({ error: 'Erro ao buscar notas' });
    }
  }
}
