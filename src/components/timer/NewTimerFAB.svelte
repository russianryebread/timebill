<script>
  import ProjectPicker from './ProjectPicker.svelte'
  import { Plus } from 'lucide-svelte'

  let open = false
</script>

<button
  on:click={() => open = true}
  class="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-500
         shadow-lg shadow-teal-900/50 flex items-center justify-center
         text-white transition-colors active:scale-95"
  aria-label="Start new timer"
>
  <Plus size={24} />
</button>

{#if open}
  <ProjectPicker onClose={() => open = false} />
{/if}
