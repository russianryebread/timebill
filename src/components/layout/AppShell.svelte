<script>
  import NavBar from './NavBar.svelte'
  import Drawer from './Drawer.svelte'
  import { drawerOpen } from '../../store/index.js'
</script>

<NavBar />
<Drawer />

<!-- Main content — shifts right on desktop when drawer is open -->
<main
  class="min-h-[calc(100dvh-3.5rem)] transition-all duration-200
         {$drawerOpen ? 'md:ml-72' : ''}"
>
  <slot />
</main>
