<script>
	import { onMount } from 'svelte';
	export let state;

	let buttonResolution = null;

	onMount(
		() =>
			(state.promise = new Promise((resolve, reject) => {
				buttonResolution = resolve;
			}))
	);
</script>

<p>
	{state.text}
</p>
<div>
  <button onclick={() => buttonResolution()}> Click here when ready to begin! </button>
</div>

<style>
  p {
    text-align: center;
    font-size: 20px;
  }
  div {
    width: 100%;
  }
  button {
    margin: auto;
  }

</style>
