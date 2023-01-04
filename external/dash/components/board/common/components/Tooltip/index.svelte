<script>
  import { fade } from "svelte/transition";
  let opened = false;
  export let isRightPositioned;
  function toggleOpened() {
    opened = !opened;
  }
</script>

<style>
  .tooltip-wrapper {
    @apply inline-block align-middle leading-28 overflow-visible;
  }

  .opened {
    width: 248px;
    @apply absolute mt-4 block bg-shark rounded-md z-10;
  }

  .closed {
    @apply hidden;
  }

  .tooltip-content-wrapper {
    @apply relative px-6 py-2 leading-16 text-xxs text-white;
  }

  .arrow-up {
    top: -5px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #2a2e36;
    @apply absolute h-0;
  }

  .tooltip-left-pos {
    left: -36px;
  }

  .tooltip-right-pos {
    right: -24px;
  }

  @media only screen and (max-width: 767px) {
    .opened {
      left: 0;
    }

    .arrow-up {
      display: none;
    }
  }
</style>

{@debug opened}
<div class="tooltip-wrapper md:relative">
  <div on:mouseover={toggleOpened} on:mouseout={toggleOpened}>
    <slot name="trigger" />
  </div>
  {#if opened}
    <div class="{opened ? 'opened' : 'closed'} {!isRightPositioned ? 'tooltip-left-pos' : 'tooltip-right-pos'}">
      <div class="tooltip-content-wrapper">
        <slot name="content" />
        <div class="arrow-up" style={!isRightPositioned ? 'left: 45px' : 'right: 24px'} />
      </div>
    </div>
  {/if}
</div>
