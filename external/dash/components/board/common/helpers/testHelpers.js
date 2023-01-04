import { sleep } from "./common";

const expectPeriodically = (
  period,
  totalIterations,
  expectation,
  preSetters
) => {
  let prom = Promise.resolve();
  for (let i = 0; i < totalIterations; i += 1) {
    prom = prom
      .then(() => sleep(period))
      .then(() => {
        if (typeof preSetters === "function") preSetters();
        expectation();
      });
  }
  return prom;
};
export { expectPeriodically };
