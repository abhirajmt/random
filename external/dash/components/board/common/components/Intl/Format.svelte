<script context="module">
  import { replaceVariablesInString } from "~/common/helpers";

  const getMessage = (message, values, variablesMap = {}) => {
    if (message === undefined) return;
    const parsedMessage = Object.keys(values).reduce(
      (acc, key) => acc.replace(`{${key}}`, values[key]),
      message
    );
    const replacedMessage =  replaceVariablesInString(parsedMessage, variablesMap);
    return replacedMessage;
  };
</script>

<script>
  import { getContext } from "svelte";
  import { context } from "./constants";

  export let id;
  export let values = {};
  export let defaultMessage;
  export let onlyTranslated;
  export let onlyDefault;

  let messages = {};

  const { storedTranslations, variablesMap } = getContext(context.intl);

  storedTranslations.subscribe((json) => {
    messages = json;
  });
</script>

<span>
  {#if onlyDefault}
    {getMessage(defaultMessage, values, variablesMap)}
  {:else if onlyTranslated}
    {getMessage(messages[id], values, variablesMap)}
  {:else}
    {getMessage(messages[id], values, variablesMap) || getMessage(defaultMessage, values, variablesMap)}
  {/if}
</span>
