import Vue from "vue";
import Router from "vue-router";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import AddDrop from "./pages/AddDrop";
import Royalties from "./pages/Royalties";

Vue.use(Router);

export default new Router({
    // Make sure the server can handle the history mode
    // If not, set it to hash (or delete the mode)
    // More info here: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
    mode: "history",
    routes: [
        {
            path: "/",
            name: "homepage",
            component: Homepage
        },
        {
          path: "/dashboard",
          name: "dashboard",
          component: Dashboard
        },
        {
            path: "/addDrop",
            name: "addDrop",
            component: AddDrop
        },
        {
            path: "/royalties",
            name: "royalties",
            component: Royalties
        },
        {
            path: "/profile",
            name: "profile",
            component: Profile
        }
    ],
    linkActiveClass: "active"
});