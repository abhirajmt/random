/* eslint-disable complexity */
// import { get } from '@mindtickle/api-helpers';
// import { isEmpty } from '@mindtickle/utils';
import get from 'node-fetch';
import ApiUrls from '../config/api.config';

const permissionsByCompany = {};

const parseRolesPermissions = (
  companyId,
  { roles: { permissions = {}, permissionOrder = {}, roles = {} } }
) => {
  let rolesNameMap = {},
    rolesPermissionsMap = {};
  for (const [id, { name, permissions: rolePermissions }] of Object.entries(roles)) {
    rolesNameMap[id] = name;
    rolesPermissionsMap[id] = rolesPermissionsMap[id] || {
      OVERRIDE: [],
      DENY: [],
      ALLOW: [],
    };
    for (const [permission, mode] of Object.entries(rolePermissions)) {
      rolesPermissionsMap[id][mode].push(permission);
    }
  }

  permissionsByCompany[companyId] = {
    permissionsNameMap: permissions || {},
    permissionsOrder: permissionOrder || {},
    rolesNameMap: rolesNameMap || {},
    rolesPermissionsMap: rolesPermissionsMap || {},
  };

  return permissionsByCompany[companyId];
};

const fetchRolesPermissions = async companyId => {
  if (permissionsByCompany[companyId]) {
    await Promise.resolve();
    return {
      companyPermissions: permissionsByCompany[companyId],
      allRoles: {},
    };
  } else {
    try {
      let res = await get(ApiUrls.getAllRolesPermissions());
      res = await res.json();
      const { rolesData: roles = {} } = res;
      return {
        companyPermissions: parseRolesPermissions(companyId, { roles }),
        allRoles: roles.roles,
      };
    } catch (error) {
      console.log('permissions get fail'); //eslint-disable-line
    }
  }
};

export const getPermissionByRoles = async (companyId, roles, rolesData = {}) => {
  let permissionsObj;
  if (!Object.keys(rolesData).length) {
    permissionsObj = await fetchRolesPermissions(companyId);
  } else {
    permissionsObj = {
      companyPermissions: parseRolesPermissions(companyId, {
        roles: rolesData,
      }),
      allRoles: rolesData.roles,
    };
  }
  const { companyPermissions, allRoles } = permissionsObj || {};
  if (!companyPermissions) {
    return { permissions: [], allRoles: [] };
  }
  const permissionsByRoles = companyPermissions.rolesPermissionsMap;

  if (!Array.isArray(roles)) roles = [roles];
  const permissions = roles.reduce(
    (permissions, role) => {
      const { OVERRIDE = [], DENY = [], ALLOW = [] } = permissionsByRoles[role] || {};
      permissions.OVERRIDE = permissions.OVERRIDE.concat(OVERRIDE);
      permissions.ALLOW = permissions.ALLOW.concat(ALLOW);
      permissions.DENY = permissions.DENY.concat(DENY);
      return permissions;
    },
    { OVERRIDE: [], DENY: [], ALLOW: [] }
  );
  permissions.DENY = permissions.DENY.subtract(permissions.OVERRIDE);
  permissions.ALLOW = permissions.ALLOW.subtract(permissions.OVERRIDE);
  return { permissions, allRoles };
};
