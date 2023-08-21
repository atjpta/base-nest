import { SetMetadata } from '@nestjs/common';
import { RoleConstant } from 'src/modules/role/constant/role.constant';

export const ROLES_KEY = 'roles';

// Function to check if a role is valid
const isValidRole = (role: string): boolean => {
  return Object.values(RoleConstant.LIST_ROLES).includes(role);
};

// Modify the hasRoles decorator to validate the roles
export const HasRoles = (...roles: string[]) => {
  // Filter out any invalid roles
  const validRoles = roles.filter((role) => isValidRole(role));
  // Set the valid roles as metadata
  return SetMetadata(ROLES_KEY, validRoles);
};
