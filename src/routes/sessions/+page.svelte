<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    
    export let data: PageData;
    export let form

    $:sessions = data._sessions
</script>

<h1>Session</h1>

<ul>
    {#each sessions as session}
        <li><a href="/sessions/{session}">{session}</a></li>
    {/each}

</ul>


<hr />

<h1> New session </h1>

<form action="?/create" method="post" use:enhance>
    <input type="text" name="sessionName"> 
    <button>create</button>
    {#if form?.sessionName}
        <span>form.sessionName</span>
    {/if}
</form>