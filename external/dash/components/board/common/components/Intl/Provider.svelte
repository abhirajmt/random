<script>
  import { beforeUpdate, setContext, onMount } from "svelte";
  import { derived, writable } from "svelte/store";
  import { defaultLocale, context } from "./constants";
  import { getStores } from "./store";

  export let
  fetchLocale,
  locale = defaultLocale,
  variablesMap;

  const { language, storedTranslations } = getStores(fetchLocale, locale);

  // Trigger a pre-fetch
  onMount(() => storedTranslations.subscribe(() => null));

  setContext(context.intl, {
    language,
    storedTranslations,
    variablesMap
  });

  $: {
    language.set(locale);
  }
</script>

<slot />
