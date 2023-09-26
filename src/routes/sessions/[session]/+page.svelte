<script lang="ts">
    import { browser } from "$app/environment";
    import { invalidate, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import { onDestroy } from "svelte";
    import type { PageData } from "./$types";
    export let data: PageData;

    if (browser) {
        let i = setInterval(invalidateAll, 1000);
        onDestroy(() => {
            clearInterval(i);
        });
    }
</script>

<h1>Välkommen till session: {$page.params.session}</h1>

<form action="?/message" method="post">
    <input type="text" name="message" />
    <button>Send</button>
</form>

<div class="messages">
    {#each data.messages as message}
        <span>{message}</span>
    {/each}
</div>

<style>
    .messages {
        display: flex;
        flex-direction: column;
    }
</style>
