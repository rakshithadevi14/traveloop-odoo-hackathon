import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import { createTripNote, deleteTripNote, getTripNotes, updateTripNote } from './api.js';

const stopOptions = ['General', 'Stop 1', 'Stop 2', 'Stop 3'];

const fallbackNotes = [
  {
    id: 'n1',
    title: 'Arrival checklist',
    stop: 'General',
    date: '2026-06-12',
    content: 'Check hotel check-in time and airport transfer.',
    updatedAt: '2026-06-01T10:00:00.000Z'
  },
  {
    id: 'n2',
    title: 'Day 2 plans',
    stop: 'Stop 1',
    date: '2026-06-13',
    content: 'Visit Fort Aguada before sunset.',
    updatedAt: '2026-06-02T09:30:00.000Z'
  }
];

function normalizeNotes(payload) {
  const notes = Array.isArray(payload) ? payload : payload?.notes || payload?.data || [];
  return notes.map((note) => ({
    id: note?._id || note?.id,
    title: note?.title || 'Untitled Note',
    stop: note?.stop || note?.section || 'General',
    date: note?.date ? String(note.date).slice(0, 10) : '',
    content: note?.content || note?.body || '',
    updatedAt: note?.updatedAt || note?.createdAt || new Date().toISOString()
  }));
}

export default function TripNotes() {
  const { id: tripId } = useParams();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes]);

  const selectedNote = useMemo(() => notes.find((note) => note.id === selectedId) || null, [notes, selectedId]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const payload = await getTripNotes(tripId);
      const normalized = normalizeNotes(payload);
      setNotes(normalized);
      setSelectedId(normalized[0]?.id || '');
    } catch {
      setNotes(fallbackNotes);
      setSelectedId(fallbackNotes[0]?.id || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [tripId]);

  const updateLocalNote = (id, patch) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...patch } : note)));
  };

  const onBlurSave = async (note) => {
    if (!note) return;
    try {
      await updateTripNote(tripId, note.id, {
        title: note.title,
        stop: note.stop,
        date: note.date,
        content: note.content
      });
      updateLocalNote(note.id, { updatedAt: new Date().toISOString() });
      toast.success('Note saved');
    } catch (error) {
      toast.error(error.message || 'Failed to save note');
    }
  };

  const onCreateNote = async () => {
    const draft = {
      title: 'New note',
      stop: 'General',
      date: new Date().toISOString().slice(0, 10),
      content: ''
    };

    try {
      const created = await createTripNote(tripId, draft);
      const normalized = normalizeNotes([created])[0];
      setNotes((prev) => [normalized, ...prev]);
      setSelectedId(normalized.id);
      toast.success('Note created');
    } catch (error) {
      toast.error(error.message || 'Failed to create note');
    }
  };

  const onDeleteNote = async () => {
    if (!deleteTarget) return;

    try {
      await deleteTripNote(tripId, deleteTarget.id);
      setNotes((prev) => prev.filter((note) => note.id !== deleteTarget.id));
      if (selectedId === deleteTarget.id) {
        const remaining = notes.filter((note) => note.id !== deleteTarget.id);
        setSelectedId(remaining[0]?.id || '');
      }
      setDeleteTarget(null);
      toast.success('Note deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete note');
    }
  };

  if (loading) {
    return <div className='h-64 animate-pulse rounded-2xl border border-slate-200 bg-white' />;
  }

  return (
    <section className='page-in grid gap-4 lg:grid-cols-3'>
      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Notes</h3>
          <button className='btn-primary inline-flex items-center gap-1 !px-3 !py-2 text-sm' onClick={onCreateNote}>
            <PlusCircle size={14} /> New Note
          </button>
        </div>

        <div className='space-y-2'>
          {sortedNotes.length === 0 ? <div className='text-sm text-slate-500'>No notes yet.</div> : null}
          {sortedNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={`w-full rounded-xl border px-3 py-2 text-left ${selectedId === note.id ? 'border-[#0D9488] bg-teal-50' : 'border-slate-200 bg-white'}`}
            >
              <p className='font-medium text-slate-800'>{note.title}</p>
              <p className='text-xs text-slate-500'>{new Date(note.updatedAt).toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>

      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2'>
        {!selectedNote ? (
          <div className='text-sm text-slate-500'>Select a note to edit.</div>
        ) : (
          <div className='space-y-3'>
            <input
              className='input'
              value={selectedNote.title}
              onChange={(e) => updateLocalNote(selectedNote.id, { title: e.target.value })}
              onBlur={() => onBlurSave(selectedNote)}
              placeholder='Title'
            />

            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
              <select
                className='input'
                value={selectedNote.stop}
                onChange={(e) => updateLocalNote(selectedNote.id, { stop: e.target.value })}
                onBlur={() => onBlurSave(selectedNote)}
              >
                {stopOptions.map((stop) => (
                  <option key={stop} value={stop}>{stop}</option>
                ))}
              </select>
              <input
                type='date'
                className='input'
                value={selectedNote.date}
                onChange={(e) => updateLocalNote(selectedNote.id, { date: e.target.value })}
                onBlur={() => onBlurSave(selectedNote)}
              />
            </div>

            <textarea
              className='input min-h-72'
              value={selectedNote.content}
              onChange={(e) => updateLocalNote(selectedNote.id, { content: e.target.value })}
              onBlur={() => onBlurSave(selectedNote)}
              placeholder='Write your note...'
            />

            <div className='flex justify-end'>
              <button className='rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700' onClick={() => setDeleteTarget(selectedNote)}>
                <span className='inline-flex items-center gap-1'><Trash2 size={14} /> Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteTarget ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
            <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Delete this note?</h3>
            <p className='mt-2 text-sm text-slate-500'>{deleteTarget.title}</p>
            <div className='mt-4 flex justify-end gap-2'>
              <button className='btn-secondary' onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className='rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700' onClick={onDeleteNote}>Delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
