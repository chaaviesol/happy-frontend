import "./App.css";
import { privateRoutes, customerRoutes, publicRoutes, supplierRoutes } from "./routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            //Public Routes----------------------
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            //Protected Admin Routes-------------
            <Route element={<RequireAuth allowedRoles={["SU", "ADM"]} />}>
              {privateRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
            //Protected Supplier Routes-------------
            <Route element={<RequireAuth allowedRoles={["SUP"]} />}>
              {supplierRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
            Protected Customer Routes-------------
            <Route element={<RequireAuth allowedRoles={["CUS"]} />}>
              {customerRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
