import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import {HeroUIProvider} from "@heroui/react";
import ContextToken, { AuthContext } from "./Context/Contexttoken";
import Product from "./Context/Product";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layoutcomment from "./components/CommentDetails/Layoutcomment";
import Profile from "./components/Profile/Profile";
import { ToastContainer } from "react-toastify";
import ChangePassowrd from "./components/Changepawword/ChangePassowrd";


const router = createBrowserRouter([
  {
    path: "",
    element:<ContextToken> <Layout />  </ContextToken>,
    children: [
      { index: true, element: <Product> <Home /> </Product> },
      { path: "home", element: <Product>  <Home /> </Product> },
      { path: "profile", element:<Product>  <Profile /> </Product>  },
      { path: "changePassword", element: <Product>  <ChangePassowrd /> </Product> },
      { path: "login", element: <Login /> },
      { path: "Layoutcomment/:id", element:<Product>  <Layoutcomment /> </Product>  },

      { path: "register", element: <Register /> },
      
      {
        path: "*", element: <div className="bg-black justify-content-center flex h-screen text-center ">
        <h1 className="text-white te  "> 4 0 4</h1>
      </div>},
    ],
  },
]);

const queryconfig=new QueryClient
export default function App() {

  return (
    
    <QueryClientProvider client={queryconfig}>
      <AuthContext.Provider>
        <HeroUIProvider>
          <RouterProvider router={router} />;
          </HeroUIProvider>
      </AuthContext.Provider>
     <ToastContainer
        position="top-center"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"/>
    </QueryClientProvider>
    
  
  )
}
