<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  onMount(() => {
    goto('/settings/workspace', { replaceState: true });
  });
</script>

<div class="p-8 text-sm text-slate-500">Opening settings…</div>
