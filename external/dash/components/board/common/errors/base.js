import { BaseError } from "make-error-cause";

import ErrorCodes from "./error.codes";

class BaseWidgetError extends BaseError {
  constructor(message, code, cause) {
    super(message, cause);
    this.code = code || ErrorCodes.UNKNOWN_ERROR;
    this.formatted = {
      type: this.name,
      code: this.code,
      stack: this.stack,
      message: this.message,
    };
  }

  printCause() {
    console.error(this.cause); // eslint-disable-line
  }

  print() {
    console.error(this.formatted); // eslint-disable-line
  }

  printTable() {
    console.table(this.formatted); // eslint-disable-line
  }
}

export default BaseWidgetError;
