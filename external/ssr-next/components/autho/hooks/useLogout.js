import { isAdminSite } from '../utils';
//[TODO] change import and consume from core-helpers
import { logout as adminLogout } from '../containers/AdminAuth';
import { logout as lsLogout } from '../containers/LSAuth';

const useLogout = () => (isAdminSite() ? adminLogout : lsLogout);

export default useLogout;
