// import { SignInButton } from "@clerk/clerk-react";
// import {
//   Authenticated,
//   Unauthenticated,
// } from "convex/react";

// export default function App() {
//   return (
//     <main className="container max-w-2xl flex flex-col gap-8">
//       <h1 className="text-4xl font-extrabold my-8 text-center">
//         Hi!
//       </h1>
//       <Authenticated>
//         Yo!
//       </Authenticated>
//       <Unauthenticated>
//         <div className="flex justify-center">
//           <SignInButton mode="modal">
//             <button>Sign in</button>
//           </SignInButton>
//         </div>
//       </Unauthenticated>
//     </main>
//   );
// }

import 'animate.css/animate.min.css'
import Board from './pages/Board'
import { useState, createContext } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import List from './pages/List'
import Root from './pages/root'
import Issue from './pages/Issue'

interface MenuContextInterface {
  showMenu: boolean
  setShowMenu: (show: boolean) => void
}

export const MenuContext = createContext(null as MenuContextInterface | null)

const router = createBrowserRouter([
  {
    path: `/`,
    element: <Root />,
    loader: async () => {
      console.time(`preload`)
      // await preloadShape(issueShape)
      console.timeEnd(`preload`)
      return null
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
        path: `/board`,
        element: <Board />,
      },
      {
        path: `/issue/:id`,
        element: <Issue />,
      },
    ],
  },
])

const App = () => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <MenuContext.Provider value={{ showMenu, setShowMenu }}>
      <RouterProvider router={router} />
    </MenuContext.Provider>
  )
}

export default App
