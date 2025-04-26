import { NoteController } from '../http/controllers/notes-controller';
import { StoreController } from '../http/controllers/store-controller';
import { authMiddleware } from '../middlewares/auth';
import { Router } from 'express';

const notesRoutes = Router();

notesRoutes.get(
    '/', 
    authMiddleware,
    new NoteController().getNotes
)

notesRoutes.get(
    '/search', 
    authMiddleware,
    new NoteController().searchNotes
)

notesRoutes.get(
    '/category/:category', 
    authMiddleware, 
    new NoteController().getNotesByCategory
)

notesRoutes.get(
    '/status/:status', 
    authMiddleware, 
    new NoteController().getNotesByStatus
)

notesRoutes.get(
    '/:id', 
    authMiddleware, 
    new NoteController().getNoteById
)

notesRoutes.post(
    '/', 
    authMiddleware, 
    new NoteController().createNote
)

notesRoutes.put(
    '/:id', 
    authMiddleware, 
    new NoteController().updateNote
)

notesRoutes.delete(
    '/:id', 
    authMiddleware, 
    new NoteController().deleteNote
)

export default notesRoutes;
