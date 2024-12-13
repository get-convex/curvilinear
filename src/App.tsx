import { SignInButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import "animate.css/animate.min.css";
import { useState, createContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import List from "./pages/List";
import Root from "./pages/root";
import Issue from "./pages/Issue";
import { localStore } from "./convex";
import { preload } from "./local/queries";

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
      console.time(`preload`);
      await new Promise((resolve, reject) => {
        const subscriptionId = localStore.addSyncQuery(
          preload.handler,
          {},
          (result) => {
            if (result.kind === "loading") {
              return;
            }
            // XXX: Have the layer above pass in `subscriptionId` to the callback.
            queueMicrotask(() => localStore.removeSyncQuery(subscriptionId));
            if (result.status === "success") {
              resolve(result);
            } else {
              reject(result.error);
            }
          },
          "preload",
        );
      });
      console.timeEnd(`preload`);
      return null;
    },
    children: [
      {
        path: `/`,
        element: <List />,
      },
      {
        path: `/search`,
        element: <List showSearch={true} />,
      },
      {
        path: `/issue/:id`,
        element: <Issue />,
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
