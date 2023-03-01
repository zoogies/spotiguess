<script>
    var clientid = window.localStorage.getItem('spotify_access_token');
    var expires = window.localStorage.getItem('spotify_token_expires');
</script>

<main>
    <p>{clientid}</p>
    <p>{expires}</p>
</main>