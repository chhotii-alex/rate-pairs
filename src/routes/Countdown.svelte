<script>
  import { onMount } from 'svelte';

  export let dynamic = true;

  let seconds = 15;
  let timerColor = 'green';

  function updateColor() {
    if (seconds >= 6) {
      timerColor = 'green';
    } else if (seconds >= 3) {
      timerColor = 'orange';
    } else {
      timerColor = 'red';
    }
  }

  function formatTime(s) {
    return `0:${s.toString().padStart(2, '0')}`;
  }

  onMount(() => {
    if (dynamic) {
    const timer = setInterval(() => {
      if (seconds >= 0) {
        seconds--;
        updateColor();
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
    }
  });
</script>

<div style="font-size: 40px; font-weight: bold; color: {timerColor};">
  {#if seconds >= 0}
    {formatTime(seconds)}
  {/if}
</div>

<style>
	div {
	  text-align: center;
	}
	
</style>
