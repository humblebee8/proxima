<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
	import { lastMenuClicked, menuItems as mainmenu } from "../navigation/navigationStore";

    export let menuItems = [];
    let currentPath = '', visible = false;
    onMount(() => {
        mainmenu.set(menuItems);
        currentPath = window.location.pathname.replace('/', '');
        visible = true;
    });
</script>
{#if visible}
    <ul class="w-full flex text-2xl">
        {#each menuItems as item, index}
            <li 
                on:click={() => {lastMenuClicked.set(item.slug)}}
                transition:fly={{duration: 300, y: -200, delay: index * 100}}
                class:active={currentPath === item.slug ? 'active' : ''}
                class="inline-block text-center flex-grow uppercase cursor-pointer text-yellow-700 
                text-4xl transition-all duration-1000 font-bold hover:text-yellow-300
            ">
                {#if item.preventDefault && item.preventDefault === true}
                    <a 
                        class="block p-3" 
                        href="#{undefined === item.slug ? '' : item.slug}"
                        title="navigate to {item.label}"
                    >
                        {undefined === item.label ? 'LABEL MISSING' : item.label}    
                    </a>
                {:else}
                    <a 
                        class="block p-3" 
                        href="/{undefined === item.slug ? '' : item.slug}"
                        title="navigate to {item.label}"
                    >
                        {undefined === item.label ? 'LABEL MISSING' : item.label}    
                    </a>
                {/if}
            </li>
        {/each}
    </ul>
{/if}