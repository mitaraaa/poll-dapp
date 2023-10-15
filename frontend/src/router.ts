import { RootRoute, Route, Router } from "@tanstack/react-router";
import { Create, Index, Poll } from "./routes";
let rootRoute = new RootRoute();

const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Index,
});

const createPollRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "create",
});

const createPollIndexRoute = new Route({
    getParentRoute: () => createPollRoute,
    path: "/",
    component: Create,
});

const pollsRoute = new Route({ getParentRoute: () => rootRoute, path: "poll" });

const pollRoute = new Route({
    getParentRoute: () => pollsRoute,
    path: "$contractAddress",
    component: Poll,
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    createPollRoute.addChildren([createPollIndexRoute]),
    pollsRoute.addChildren([pollRoute]),
]);

const router = new Router({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export { router };
