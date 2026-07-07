<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import LandingPage from '$lib/components/LandingPage.svelte';
  import TimeTracker from '$lib/components/TimeTracker.svelte';
</script>

{#if !auth.isLoggedIn}
  <LandingPage />
{:else}
  <TimeTracker />
{/if}
