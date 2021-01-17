/**
 * NOTES:
 * - Possible scopes: INTERNAL, PUBLIC, ADMIN, and USER
 * - Base paths and routes should be all LOWERCASE
 * - We only support routes of the following formats for the time being:
 *      - /resource
 *      - /resource/{id}
 *      - /resource/{id}/action
 */
export const basePaths = ["users", "auth", "images"];

export const authConfig = {
  "/users": {
    get: {
      scope: "USER",
      userProtected: false,
    },
    post: {
      scope: "PUBLIC",
      userProtected: false,
    },
  },
  "/users/{id}": {
    get: {
      scope: "USER",
      userProtected: false,
    },
    put: {
      scope: "USER",
      userProtected: true,
    },
    delete: {
      scope: "USER",
      userProtected: true,
    },
  },
  "/images": {
    get: {
      scope: "USER",
      userProtected: false,
    },
    post: {
      scope: "PUBLIC",
      userProtected: false,
    },
  },
  "/images/{id}": {
    get: {
      scope: "USER",
      userProtected: true,
    },
    delete: {
      scope: "USER",
      userProtected: true,
    },
  },
  "/images/{id}/info": {
    get: {
      scope: "USER",
      userProtected: true,
    },
  },
  "/auth/login": {
    post: {
      scope: "PUBLIC",
      userProtected: false,
    },
  },
};
