<script>
	import { onMount } from 'svelte';
	import { makeTimePromise } from './util.js';
	import PicturePair from './PicturePair.svelte';
	import Countdown from './Countdown.svelte';
	export let state;

	let buttonResolution = null;

	onMount(() => {
		let timeoutPromise = makeTimePromise(15.1);
		let buttonPromise = new Promise((resolve, reject) => {
			buttonResolution = resolve;
		});
		state.promise = Promise.race([timeoutPromise, buttonPromise]);
	});
</script>

<p>Choose the picture whose contours match better.</p>
<Countdown />
<PicturePair
	bind:selectedPictureIndex={state.selected}
	pair={state.pair}
	labels={null}
	clickable="true"
/>
<div>
	<button onclick={() => buttonResolution('click')} disabled={state.selected == null}>
		Next
	</button>
</div>

<style>
	p {
		text-align: center;
		font-size: 40px;
	}
	div {
		width: 100%;
		margin: auto;
	}
	button {
		padding: 4px 26px;
		margin: 20px auto;
		font-size: 42px;
		border-radius: 10px;
		display: block;
	}
</style>
