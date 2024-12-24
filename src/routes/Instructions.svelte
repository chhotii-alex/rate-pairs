<script>
	import { onMount } from 'svelte';
	import Countdown from './Countdown.svelte';
	import PicturePair from './PicturePair.svelte';
	export let state;

	let buttonResolution = null;
	let buttonText = state.buttonText ? state.buttonText : 'Next';

	onMount(
		() =>
			(state.promise = new Promise((resolve, reject) => {
				buttonResolution = resolve;
			}))
	);
</script>

<p>
	{@html state.text}
</p>
{#if state.pair}
     <Countdown dynamic={false} />
	<PicturePair selectedPictureIndex={state.selected} pair={state.pair} labels={state.labels} />
{/if}
<div>
	<button onclick={() => buttonResolution()}> {buttonText} </button>
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
