import { createBrowserRouter } from "react-router-dom";
import { PageRoutes } from "./PageRoutes";


export const Router = createBrowserRouter([

  {
    children: [
      {
        children: PageRoutes, 
      },
    ],
  },
]);
