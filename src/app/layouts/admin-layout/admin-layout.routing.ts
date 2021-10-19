import { Routes } from "@angular/router";
import { HistoryComponent } from "src/app/pages/history/history.component";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";

import { MapComponent } from "../../pages/map/map.component";

import { TablesComponent } from "../../pages/tables/tables.component";

/* This adds the route to the certian page on the sidebar */
export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "maps", component: MapComponent },
  { path: "tables", component: TablesComponent },
  { path: "history", component: HistoryComponent}
];