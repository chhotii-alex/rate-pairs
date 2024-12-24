<script>
	import { makeEternalPromise } from './util.js';
	import { onMount } from 'svelte';
	export let state;

	onMount(() => (state.promise = makeEternalPromise()));
</script>

<h1>Done!</h1>
Thank you.
