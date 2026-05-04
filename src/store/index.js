import { writable } from 'svelte/store'
import { persisted } from 'svelte-persisted-store'

// Persisted — survive page refresh
export const clients      = persisted('tb_clients', [])
export const projects     = persisted('tb_projects', [])
export const entries      = persisted('tb_entries', [])
export const activeTimers = persisted('tb_active_timers', [])

// Ephemeral — reset on load
export const view         = writable('timer')   // 'timer' | 'reports'
export const drawerOpen   = writable(false)
export const reportRange  = writable('7d')      // '7d' | '30d' | '12mo'
