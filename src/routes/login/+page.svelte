<script lang="ts">

    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types.js";

    export let form: ActionData;
    export let data;

</script>
<body>
    <form method="post" action="?/login" use:enhance>
        <input type="text" name="username" placeholder="Username" class="bg-black">
        <input type="password" name="password" placeholder="Password" class="bg-black">
        <button class="login-btn">Login</button>
        {#if form?.username}
            <span style="color: red;">{form.username}</span>
        {/if}
    </form>
</body>

<style>

</style>




