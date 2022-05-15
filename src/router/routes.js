const routes = [
  {
    path: "/",
    component: () => import("layouts/TryItOutLayout.vue"),
    children: [{ path: "", component: () => import("pages/TryItOutPage.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
