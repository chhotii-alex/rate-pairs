<script>
	import { onMount } from 'svelte';
	import { makeTimePromise } from './util.js';
	export let state;

	let buttonResolution = null;

	onMount(() => {
		let timeoutPromise = makeTimePromise(5);
		let buttonPromise = new Promise((resolve, reject) => {
			buttonResolution = resolve;
		});
		state.promise = Promise.race([timeoutPromise, buttonPromise]);
	});

	function didButton(buttonIndex) {
		if (buttonResolution != null) {
			state.selectedPicture = state.pair[buttonIndex];
			buttonResolution(state.pair[buttonIndex]);
		}
	}
</script>

<p>
	Pair {state.index + 1} of {state.totalLength}
</p>
{#each [0, 1] as j}
	<button onclick={() => didButton(j)}>
		<img src={`images/${state.pair[j]}`} width="300" height="300" />
	</button>
{/each}
<p>Please click on the better one</p>
