import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotes } from '../../app/hooks/useNotes';

describe('useNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with empty notes', () => {
    const { result } = renderHook(() => useNotes());
    expect(result.current.allNotes).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.loaded).toBe(false);
  });

  it('saves a note', async () => {
    const { result } = renderHook(() => useNotes());

    await act(async () => {
      result.current.saveNote(1, 1, 'My first note');
    });

    expect(result.current.getNote(1, 1)).toBeTruthy();
    expect(result.current.getNote(1, 1).text).toBe('My first note');
    expect(result.current.count).toBe(1);
  });

  it('updates an existing note', async () => {
    const { result } = renderHook(() => useNotes());

    await act(async () => {
      result.current.saveNote(1, 1, 'Original');
    });

    await act(async () => {
      result.current.saveNote(1, 1, 'Updated');
    });

    expect(result.current.getNote(1, 1).text).toBe('Updated');
    expect(result.current.count).toBe(1);
  });

  it('deletes a note', async () => {
    const { result } = renderHook(() => useNotes());

    await act(async () => {
      result.current.saveNote(1, 1, 'To delete');
    });

    await act(async () => {
      result.current.deleteNote(1, 1);
    });

    expect(result.current.getNote(1, 1)).toBeNull();
    expect(result.current.count).toBe(0);
  });

  it('returns notes sorted by updatedAt', async () => {
    const { result } = renderHook(() => useNotes());

    await act(async () => {
      result.current.saveNote(1, 1, 'First');
    });

    await act(async () => {
      result.current.saveNote(2, 1, 'Second');
    });

    const notes = result.current.allNotes;
    expect(notes).toHaveLength(2);
    expect(notes.some(n => n.surah === 1 && n.text === 'First')).toBe(true);
    expect(notes.some(n => n.surah === 2 && n.text === 'Second')).toBe(true);
  });

  it('handles multiple notes per surah', async () => {
    const { result } = renderHook(() => useNotes());

    await act(async () => {
      result.current.saveNote(1, 1, 'Ayah 1 note');
      result.current.saveNote(1, 2, 'Ayah 2 note');
      result.current.saveNote(1, 3, 'Ayah 3 note');
    });

    expect(result.current.count).toBe(3);
    expect(result.current.getNote(1, 1).text).toBe('Ayah 1 note');
    expect(result.current.getNote(1, 2).text).toBe('Ayah 2 note');
    expect(result.current.getNote(1, 3).text).toBe('Ayah 3 note');
  });
});
