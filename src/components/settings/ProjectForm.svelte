<script>
  import { clients } from '../../store/index.js'
  import { addProject, updateProject } from '../../store/actions.js'
  import { X } from 'lucide-svelte'

  export let project = null
  export let onDone = () => {}

  let name = project?.name ?? ''
  let clientId = project?.clientId ?? ($clients[0]?.id ?? '')
  let hourlyRate = project?.hourlyRate ?? ''
  let monthlyHourBudget = project?.monthlyHourBudget ?? ''

  function save() {
    const trimmed = name.trim()
    if (!trimmed || !clientId) return
    const data = {
      name: trimmed,
      clientId,
      hourlyRate: parseFloat(hourlyRate) || 0,
      monthlyHourBudget: monthlyHourBudget ? parseFloat(monthlyHourBudget) : null,
    }
    if (project) {
      updateProject(project.id, data)
    } else {
      addProject(data)
    }
    onDone()
  }
</script>

<div class="p-4 space-y-3">
  <div class="flex items-center justify-between">
    <h3 class="text-sm font-semibold text-slate-200">{project ? 'Edit Project' : 'New Project'}</h3>
    <button on:click={onDone} class="text-slate-400 hover:text-white"><X size={16}/></button>
  </div>

  <input
    type="text"
    placeholder="Project name"
    bind:value={name}
    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100
           placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
  />

  <select
    bind:value={clientId}
    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100
           focus:outline-none focus:ring-2 focus:ring-teal-500"
  >
    {#each $clients as c}
      <option value={c.id}>{c.name}</option>
    {/each}
  </select>

  <div class="flex gap-2">
    <div class="flex-1">
      <label for="rate" class="text-xs text-slate-400 block mb-1">Hourly Rate ($)</label>
      <input
        id="rate"
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        bind:value={hourlyRate}
        class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100
               placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
    <div class="flex-1">
      <label for="budget" class="text-xs text-slate-400 block mb-1">Monthly Budget (hrs)</label>
      <input
        id="budget"
        type="number"
        min="0"
        step="1"
        placeholder="None"
        bind:value={monthlyHourBudget}
        class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100
               placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  </div>

  <button
    on:click={save}
    class="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
  >
    {project ? 'Save' : 'Add Project'}
  </button>
</div>
