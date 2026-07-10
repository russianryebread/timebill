<script lang="ts">
  import '../app.css';
  import { auth } from '$lib/auth.svelte';
  import { workspace } from '$lib/workspace.svelte';
  import { timer } from '$lib/timer.svelte';
  import { idle } from '$lib/idle.svelte';
  import { realtime } from '$lib/realtime.svelte';
  import AppShell from '$lib/components/AppShell.svelte';
  import IdleReturnModal from '$lib/components/IdleReturnModal.svelte';
  import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';

  let { children } = $props();

  const publicPaths = ['/login', '/signup', '/'];
  // / is always the marketing landing page (public, no AppShell).
  let isPublic = $derived(publicPaths.includes($page.url.pathname));
  let isChromeless = $derived($page.url.pathname.startsWith('/menubar') || $page.url.pathname.startsWith('/i/'));

  $effect(() => {
    const path = $page.url.pathname;
    if (!auth.isLoggedIn && !publicPaths.includes(path)) {
      goto('/login');
    } else if (auth.isLoggedIn && path === '/') {
      // Redirect logged-in users away from the marketing page.
      // Desktop → dashboard, mobile → time tracking.
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      goto(isMobile ? '/time' : '/dashboard');
    } else if (auth.isLoggedIn && path === '/time' && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      // Desktop: /time redirects to /dashboard (TimeTracker is a card there).
      goto('/dashboard');
    } else if (auth.isLoggedIn && publicPaths.includes(path) && path !== '/') {
      goto('/');
    }
  });

  let timerInitialized = false;
  $effect(() => {
    if (auth.isLoggedIn && !workspace.loaded && !workspace.loading) {
      workspace.load().then(() => {
        if (!timerInitialized) {
          timer.init();
          realtime.init();
          timerInitialized = true;
        }
      });
    }
    if (!auth.isLoggedIn && timerInitialized) {
      timer.dispose();
      realtime.dispose();
      timerInitialized = false;
    }
  });

  onMount(async () => {
    // Hooks up the Tauri `idle-detected` event listener — silently no-ops
    // outside the Tauri shell, so safe to call in the web build.
    idle.init();

    // In the Tauri menubar window, redirect to /menubar. (adapter-static's
    // SPA fallback always serves index.html, so the Tauri `url: "/menubar"`
    // config lands here at `/` instead of the menubar route.)
    if (typeof (window as any).__TAURI_INTERNALS__ !== 'undefined') {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const label = getCurrentWindow().label;
        if (label === 'menubar' && !$page.url.pathname.startsWith('/menubar')) {
          goto('/menubar');
        }
      } catch (_) {}
    }
  });

  onDestroy(() => {
    timer.dispose();
    realtime.dispose();
    idle.dispose();
  });
</script>

{#if isPublic || isChromeless || !auth.isLoggedIn}
  {@render children()}
{:else}
  <AppShell>{@render children()}</AppShell>
{/if}

<!-- Surfaced everywhere (including the chromeless /menubar route). -->
<IdleReturnModal />
<ConfirmDialog />
