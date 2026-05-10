import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Check, Loader2, Notebook, Trash2 } from 'lucide-react';
import { createTripNote, deleteTripNote, getTripNotes, getTrips, updateTripNote } from '../trips/api.js';

const fmtDate = (value) => new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtDateTime = (value) =>
  new Date(value).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const normalizeNotes = (payload) => {
  const notes = Array.isArray(payload) ? payload : payload?.notes || payload?.data || [];
  return notes.map((n) => ({
    id: n?._id || n?.id,
    title: n?.title || 'Untitled Note',
    content: n?.content || '',
    updatedAt: n?.updatedAt || n?.updated_at || new Date().toISOString(),
    date: n?.date || n?.createdAt || new Date().toISOString()
  }));
};

export default function GlobalTripNotes() {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedVisible, setSavedVisible] = useState(false);
  const autoSaveTimer = useRef(null);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const list = await getTrips();
        setTrips(list);
        if (list.length > 0) setSelectedTripId(list[0]._id || list[0].id);
      } catch (error) {
        toast.error(error.message || 'Could not load trips');
      }
    };
    loadTrips();
  }, []);

  useEffect(() => {
    const loadNotes = async () => {
      if (!selectedTripId) return;
      try {
        const payload = await getTripNotes(selectedTripId);
        const normalized = normalizeNotes(payload).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setNotes(normalized);
        setSelectedNoteId(normalized[0]?.id || null);
      } catch (error) {
        toast.error(error.message || 'Could not load notes');
        setNotes([]);
        setSelectedNoteId(null);
      }
    };
    loadNotes();
  }, [selectedTripId]);

  useEffect(() => {
    const note = notes.find((n) => n.id === selectedNoteId);
    if (!note) return;
    setEditTitle(note.title);
    setEditContent(note.content);
  }, [selectedNoteId, notes]);

  const saveNote = async () => {
    if (!selectedTripId || !selectedNoteId) return;
    setSaving(true);
    try {
      const updated = await updateTripNote(selectedTripId, selectedNoteId, { title: editTitle, content: editContent });
      const note = normalizeNotes([updated])[0];
      setNotes((prev) =>
        prev
          .map((n) => (n.id === note.id ? { ...n, ...note } : n))
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
      setSavedVisible(true);
      setTimeout(() => setSavedVisible(false), 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const triggerAutoSave = () => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => saveNote(), 800);
  };

  const createNote = async () => {
    if (!selectedTripId) return;
    try {
      const created = await createTripNote(selectedTripId, { title: 'Untitled Note', content: '', date: new Date() });
      const note = normalizeNotes([created])[0];
      setNotes((prev) => [note, ...prev]);
      setSelectedNoteId(note.id);
    } catch (error) {
      toast.error(error.message || 'Could not create note');
    }
  };

  const removeNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteTripNote(selectedTripId, noteId);
      const next = notes.filter((n) => n.id !== noteId);
      setNotes(next);
      if (selectedNoteId === noteId) setSelectedNoteId(next[0]?.id || null);
    } catch (error) {
      toast.error(error.message || 'Could not delete note');
    }
  };

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  return (
    <section className='page-in rounded-xl border border-gray-200 bg-white shadow-sm'>
      <div className='flex min-h-[620px]'>
        <aside className='w-[280px] border-r border-gray-200 p-4'>
          <h2 className='font-sora text-lg font-semibold text-[#0F172A]'>Trip Notes</h2>
          <select className='input mt-3' value={selectedTripId} onChange={(e) => setSelectedTripId(e.target.value)}>
            <option value=''>Select Trip</option>
            {trips.map((trip) => (
              <option key={trip._id || trip.id} value={trip._id || trip.id}>{trip.title || trip.name}</option>
            ))}
          </select>
          <button className='btn-primary mt-3 w-full justify-center !py-2' onClick={createNote}>+ New Note</button>

          <div className='mt-3 max-h-[calc(100vh-200px)] space-y-2 overflow-y-auto'>
            {notes.length === 0 ? (
              <p className='text-sm text-slate-500'>No notes yet. Click + to add one.</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`group cursor-pointer rounded-lg border px-3 py-2 ${selectedNoteId === note.id ? 'border-[#0D9488] bg-teal-50' : 'border-gray-200'}`}
                  onClick={() => setSelectedNoteId(note.id)}
                >
                  <div className='flex items-start justify-between gap-2'>
                    <p className='truncate text-sm font-semibold text-slate-800'>{note.title}</p>
                    <button
                      className='hidden rounded p-1 text-rose-600 hover:bg-rose-50 group-hover:block'
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNote(note.id);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className='mt-1 text-xs text-slate-500'>{fmtDate(note.updatedAt)}</p>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className='relative flex-1 p-5'>
          <div className='absolute right-5 top-4 text-xs text-slate-500'>
            {saving ? (
              <span className='inline-flex items-center gap-1'><Loader2 className='animate-spin' size={13} /> Saving...</span>
            ) : savedVisible ? (
              <span className='inline-flex items-center gap-1 text-emerald-600'><Check size={13} /> Saved</span>
            ) : null}
          </div>

          {!selectedTripId ? (
            <div className='grid h-full place-items-center text-slate-500'>Select a trip to view notes</div>
          ) : notes.length === 0 ? (
            <div className='grid h-full place-items-center text-center text-slate-500'>
              <div>
                <Notebook className='mx-auto mb-2' size={26} />
                <p>No notes yet</p>
                <button className='btn-primary mt-3 !py-2' onClick={createNote}>+ New Note</button>
              </div>
            </div>
          ) : selectedNote ? (
            <div className='flex h-full flex-col'>
              <input
                className='w-full border-0 text-[22px] font-semibold text-slate-900 outline-none'
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  triggerAutoSave();
                }}
              />
              <hr className='my-3 border-gray-200' />
              <p className='text-xs text-slate-500'>Last updated: {fmtDateTime(selectedNote.updatedAt)}</p>
              <textarea
                className='mt-3 min-h-[400px] flex-1 resize-none border-0 p-4 text-[16px] leading-[1.8] outline-none'
                placeholder='Start writing your travel notes...'
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value);
                  triggerAutoSave();
                }}
              />
            </div>
          ) : null}
        </main>
      </div>
    </section>
  );
}
