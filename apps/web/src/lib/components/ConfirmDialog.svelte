<script lang="ts">
  import { confirmStore } from '$lib/confirm.svelte';

  function onKeydown(ev: KeyboardEvent) {
    if (!confirmStore.pending) return;
    if (ev.key === 'Escape') {
      ev.preventDefault();
      confirmStore.resolve(false);
    }
    if (ev.key === 'Enter') {
      ev.preventDefault();
      confirmStore.resolve(true);
    }
  }
</script>

<svelte:window on:keydown={onKeydown} />

{#if confirmStore.pending}
  {@const p = confirmStore.pending}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-dialog-message"
    tabindex="-1"
    onclick={(e) => {
      if (e.target === e.currentTarget) confirmStore.resolve(false);
    }}
  >
    <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
      <p id="confirm-dialog-message" class="text-base font-medium text-slate-900">
        {p.message}
      </p>
      {#if p.detail}
        <p class="mt-2 text-sm text-slate-600">{p.detail}</p>
      {/if}
      <div class="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          class="rounded px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          onclick={() => confirmStore.resolve(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded px-4 py-2 text-sm font-medium text-white
            {p.destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-800 hover:bg-brand-900'}"
          onclick={() => confirmStore.resolve(true)}
        >
          {p.confirmLabel}
        </button>
      </div>
    </div>
  </div>
{/if}
