<script>
  export let size = 32
</script>

<svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Body -->
  <ellipse cx="36" cy="42" rx="22" ry="16" fill="#0d9488"/>
  <!-- Head -->
  <circle cx="22" cy="26" r="14" fill="#0d9488"/>
  <!-- Bill — wide flat beak -->
  <ellipse cx="5" cy="31" rx="11" ry="5" fill="#5eead4"/>
  <!-- Nostril -->
  <ellipse cx="8" cy="29.5" rx="1.5" ry="1" fill="#0f766e"/>
  <!-- Eye -->
  <circle cx="17" cy="22" r="3" fill="#0f172a"/>
  <circle cx="16" cy="21" r="1" fill="white"/>
  <!-- Tail curl -->
  <path d="M56 36 Q64 22 58 12" stroke="#0f766e" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- Tail feather hint -->
  <path d="M56 36 Q62 28 60 18" stroke="#14b8a6" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>
