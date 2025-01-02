<script>
	import { onMount } from 'svelte';
	export let state;

	let buttonResolution = null;
	let complaint = '';

	let isBrowser = typeof window !== 'undefined';

	onMount(
		() =>
			(state.promise = new Promise((resolve, reject) => {
				buttonResolution = resolve;
			}))
	);

	function isNameOk(name) {
		if (!isBrowser) return false;
		if (!name || name.length < 1) {
			complaint = 'Please enter your alias in the input field.';
			return false;
		}
		let key = `taskdata_${name}`;
		if (key in localStorage) {
			complaint = 'Record of a participant with this alias already exists';
			return false;
		}
		complaint = '';
		return true;
	}
</script>

Pick an alias (don’t use your real name):
<input type="text" bind:value={state.participantName} />
<br />
{#if isNameOk(state.participantName)}
	<button onclick={() => buttonResolution()}> Click here when ready to begin! </button>
{/if}
{complaint}
