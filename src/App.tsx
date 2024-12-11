import { SignInButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import "animate.css/animate.min.css";
import Board from "./pages/Board";
import { useState, createContext } from "react";
import {
  createBrowserRouter,
  isRouteErrorResponse,
  RouterProvider,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import List from "./pages/List";
import Root from "./pages/root";
import Issue from "./pages/Issue";

interface MenuContextInterface {
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
}

export const MenuContext = createContext(null as MenuContextInterface | null);

const router = createBrowserRouter([
  {
    path: `/`,
    element: <Root />,
    loader: async () => {
      // XXX: Preload all issues here.
      console.time(`preload`);
      console.timeEnd(`preload`);
      return null;
    },
    // errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: `/`,
        element: <List />,
        // errorElement: <RouteErrorBoundary />,
      },
      {
        path: `/search`,
        element: <List showSearch={true} />,
        // errorElement: <RouteErrorBoundary />,
      },
      {
        path: `/board`,
        element: <Board />,
        // errorElement: <RouteErrorBoundary />,
      },
      {
        path: `/issue/:id`,
        element: <Issue />,
        // errorElement: <RouteErrorBoundary />,
      },
    ],
  },
]);

const App = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <main>
      <Authenticated>
        <MenuContext.Provider value={{ showMenu, setShowMenu }}>
          <RouterProvider router={router} />
        </MenuContext.Provider>
      </Authenticated>
      <Unauthenticated>
        <div className="flex justify-center">
          <SignInButton mode="modal">
            <button
              className="inline-flex items-center h-6 text-gray-500 border-none rounded bg-gray-100 hover:bg-gray-200"
              style={{ margin: "20px", padding: "16px" }}
            >
              Sign in
            </button>
          </SignInButton>
        </div>
      </Unauthenticated>
    </main>
  );
};

export default App;

function RouteErrorBoundary({ error }: any) {
  console.log(error);
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
