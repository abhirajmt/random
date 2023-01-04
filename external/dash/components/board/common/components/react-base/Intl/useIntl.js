import { useContext } from "react";
import { IntlDetailsContext } from "./context";

const useIntlDetails = () => {
  const intlDetails = useContext(IntlDetailsContext);
  return intlDetails;
};
export default useIntlDetails;
