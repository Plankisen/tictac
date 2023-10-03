<script lang="ts">
    export let data
</script>
<div>
    <h1>Welcome {data.username}</h1>
    <form action="/login?/logout" method="post">
        <button>Log out</button>
    </form>
</div>

<nav>
    <a href="/sessions">Sessions</a>
</nav>

<style>
    div{
        text-align: center;
        position: absolute;
        top: 40%;
        left: 0;
        right: 0;
        margin: auto;
        transform: translateY(-50%);
    }
</style>