import { get } from 'svelte/store'
import { clients, projects, entries, activeTimers } from './index.js'
import { newId } from '../utils/ids.js'
import { getLocalDateString } from '../utils/time.js'

// ── Timer ────────────────────────────────────────────────────────────────────

export function startTimer(projectId) {
  const proj = get(projects).find(p => p.id === projectId)
  if (!proj) return
  const timer = {
    id: newId(),
    projectId,
    clientId: proj.clientId,
    startedAt: Date.now(),
    notes: '',
  }
  activeTimers.update(ts => [...ts, timer])
}

export function stopTimer(timerId) {
  const timers = get(activeTimers)
  const timer = timers.find(t => t.id === timerId)
  if (!timer) return
  const stoppedAt = Date.now()
  const durationSeconds = Math.max(1, Math.floor((stoppedAt - timer.startedAt) / 1000))
  const entry = {
    id: timer.id,
    projectId: timer.projectId,
    clientId: timer.clientId,
    startedAt: timer.startedAt,
    stoppedAt,
    durationSeconds,
    notes: timer.notes,
    date: getLocalDateString(timer.startedAt),
  }
  entries.update(es => [entry, ...es])
  activeTimers.update(ts => ts.filter(t => t.id !== timerId))
}

export function updateTimerNotes(timerId, notes) {
  activeTimers.update(ts =>
    ts.map(t => t.id === timerId ? { ...t, notes } : t)
  )
}

// ── Entries ──────────────────────────────────────────────────────────────────

export function deleteEntry(entryId) {
  entries.update(es => es.filter(e => e.id !== entryId))
}

export function updateEntry(entryId, patch) {
  entries.update(es => es.map(e => e.id === entryId ? { ...e, ...patch } : e))
}

export function updateEntryDuration(entryId, durationSeconds) {
  entries.update(es => es.map(e =>
    e.id === entryId
      ? { ...e, durationSeconds, stoppedAt: e.startedAt + durationSeconds * 1000 }
      : e
  ))
}

export function archiveEntriesForClient(clientId) {
  entries.update(es => es.map(e =>
    e.clientId === clientId && !e.archived ? { ...e, archived: true } : e
  ))
}

// ── Clients ──────────────────────────────────────────────────────────────────

export function addClient(data) {
  const client = { id: newId(), createdAt: Date.now(), ...data }
  clients.update(cs => [...cs, client])
  return client.id
}

export function updateClient(clientId, patch) {
  clients.update(cs => cs.map(c => c.id === clientId ? { ...c, ...patch } : c))
}

export function deleteClient(clientId) {
  const projectIds = get(projects).filter(p => p.clientId === clientId).map(p => p.id)
  clients.update(cs => cs.filter(c => c.id !== clientId))
  projects.update(ps => ps.filter(p => p.clientId !== clientId))
  entries.update(es => es.filter(e => !projectIds.includes(e.projectId)))
  activeTimers.update(ts => ts.filter(t => t.clientId !== clientId))
}

// ── Projects ─────────────────────────────────────────────────────────────────

export function addProject(data) {
  const project = { id: newId(), archived: false, createdAt: Date.now(), ...data }
  projects.update(ps => [...ps, project])
  return project.id
}

export function updateProject(projectId, patch) {
  projects.update(ps => ps.map(p => p.id === projectId ? { ...p, ...patch } : p))
}

export function archiveProject(projectId) {
  updateProject(projectId, { archived: true })
}
