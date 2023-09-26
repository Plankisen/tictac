<script lang="ts">

    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types.js";

    export let form: ActionData;
    export let data;

</script>
<body>
    <form method="post" action="?/login" use:enhance>
        <input type="text" name="username" placeholder="Username">
        <input type="password" name="password" placeholder="Password">
        <button class="login-btn">Login</button>
        {#if form?.username}
            <span style="color: red;">{form.username}</span>
        {/if}
    </form>
</body>

<style>
    body{
        margin: 0px;
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        z-index: -1;
        overflow: hidden;
        --s: 200px;
        --c1: #1d1d1d;
        --c2: #4e4f51;
        --c3: #3c3c3c;
        background:
        repeating-conic-gradient(from 30deg,#0000 0 120deg,var(--c3) 0 180deg) 
        calc(.5*var(--s)) calc(.5*var(--s)*0.577),
        repeating-conic-gradient(from 30deg,var(--c1) 0 60deg,var(--c2) 0 120deg,var(--c3) 0 180deg);
        background-size: var(--s) calc(var(--s)*0.577);
    }
    form{
        scale: 150%;
        gap: 10px;
        display: flex;
        flex-direction: column;
        width: 200px;
        text-align: center;
        position: absolute;
        top: 45%;
        left: 0;
        right: 0;
        margin: auto;
        align-items: center;
        transform: translateY(-50%);
    }
    .login-btn{
        scale: 80%;
        width: 80px;
        background-color: initial;
        background-image: linear-gradient(-180deg, #FF7E31, #E62C03);
        border-radius: 6px;
        box-shadow: rgba(0, 0, 0, 0.1) 0 2px 4px;
        color: #FFFFFF;
        cursor: pointer;
        display: inline-block;
        font-family: Inter,-apple-system,system-ui,Roboto,"Helvetica Neue",Arial,sans-serif;
        height: 40px;
        line-height: 40px;
        outline: 0;
        overflow: hidden;
        padding: 0 20px;
        pointer-events: auto;
        position: relative;
        text-align: center;
        touch-action: manipulation;
        user-select: none;
        -webkit-user-select: none;
        vertical-align: top;
        white-space: nowrap;
        width: 100%;
        z-index: 9;
        border: 0;
        transition: box-shadow .2s;
    }
    .login-btn:hover {
        box-shadow: rgba(253, 76, 0, 0.5) 0 3px 8px;
    }
</style>




