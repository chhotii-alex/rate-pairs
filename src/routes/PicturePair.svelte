<script>
	export let selectedPictureIndex = null;
	export let clickable = false;
	export let pair;
	export let labels;
	export let firstClickTime = null;

	function didButton(buttonIndex) {
		if (clickable) {
			selectedPictureIndex = buttonIndex;
			firstClickTime = new Date();
		}
	}

	function equalNum(i, j) {
		return parseInt(i) == parseInt(j);
	}

	function classForIndex(j) {
		if (equalNum(selectedPictureIndex, j)) {
			return 'selected';
		} else {
			return '';
		}
	}
</script>

<div class="outer">
	<div class="inner">
		{#each [0, 1] as j}
			<div class="button">
				{#if labels}
					<span>
						{labels[j]}
					</span>
					<br />
				{/if}
				<button onclick={() => didButton(j)} class={classForIndex(j)}>
					<img src={`images/${pair[j]}`} width="300" height="300" />
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
	img {
		border: none;
	}
	span {
		font-size: 20px;
	}
	button {
		padding: 0px;
		margin: 5px 40px;
		border-radius: 10px;
	}
	button {
		border-width: 16px;
		border-color: lightgray;
		border-style: solid;
	}
	button.selected {
		border-color: black;
	}
	div.outer {
		text-align: center;
	}
	div.inner {
		margin: auto;
	}
	div.button {
		display: inline-block;
		font-size: 40px;
	}
</style>
