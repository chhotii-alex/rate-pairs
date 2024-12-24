<script>
	export let data;
	let now = new Date();

	$: url = makeDownloadURL(data);
	function makeDownloadURL(data) {
		const blob = new Blob([data], {
			type: 'application/json'
		});
		return URL.createObjectURL(blob);
	}
</script>

<div>
	<a href={url} download={`forced_choice_task${now}.json`} class="noprint"> Download Responses </a>
</div>
