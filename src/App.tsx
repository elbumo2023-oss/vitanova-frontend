import { RouterProvider } from "react-router-dom"
import routes from "./routes"
import { AuthProvider } from "./contexts/AuthContext"


function App() {
  return (
   <AuthProvider>
     <RouterProvider router={routes} >
     </RouterProvider>
   </AuthProvider>
  )
}

export default App