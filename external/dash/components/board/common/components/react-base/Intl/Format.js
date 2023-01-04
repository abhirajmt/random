import React from "react";
import { replaceVariablesInString } from "~/common/helpers";
import useIntlDetails from "./useIntl";
// const React = window.React;

const getMessage = (message, values, variablesMap = {}) => {
  if (message === undefined) return;
  const parsedMessage = Object.keys(values).reduce(
    (acc, key) => acc.replace(`{${key}}`, values[key]),
    message
  );
  const replacedMessage = replaceVariablesInString(parsedMessage, variablesMap);
  return replacedMessage;
};

export const Format = ({
  id,
  values = {},
  defaultMessage,
  onlyDefault,
  onlyTranslated,
}) => {
  const { variablesMap, translations: messages } = useIntlDetails();

  let message;
  if (onlyDefault) {
    message = getMessage(defaultMessage, values, variablesMap);
  } else if (onlyTranslated) {
    message = getMessage(messages[id], values, variablesMap);
  } else {
    message =
      getMessage(messages[id], values, variablesMap) ||
      getMessage(defaultMessage, values, variablesMap);
  }

  return <span>{message}</span>;
};

export default Format;
