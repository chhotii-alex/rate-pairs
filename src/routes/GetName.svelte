<script>
	import { onMount } from 'svelte';
	export let state;

	let buttonResolution = null;
	let complaint = "";

	let isBrowser = typeof window !== 'undefined';

	onMount(
		() =>
			(state.promise = new Promise((resolve, reject) => {
				buttonResolution = resolve;
			}))
	);

	function isNameOk(name) {
	   if (!isBrowser) return false;
		if (!name) {
		  complaint = "Please enter a name";
		  return false;
		}
		let key = `taskdata_${name}`;
		if (key in localStorage) {
		  complaint = "Record of a participant with this name already exists";
		  return false;
		}
		if (name.length < 1) {
		   complaint = "Please enter a name";
		   return false;
		}
		complaint = "";
		return true;
	}
</script>

Enter name of person doing the rating task:
<input type="text" bind:value={state.participantName} />
<br/>
{#if isNameOk(state.participantName)}
	<button onclick={() => buttonResolution()}> Click here when ready to begin! </button>
{/if}
{complaint}
