import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from "./components/Ar/Header";
import { LoadingSpinner } from "./components/LoadingSpinner.js";
const landingPage = lazy(() => import("./components/Ar/LandingPageAR.js"));
const routes = [
  {
    // Landing Page Arabic:
    path: "/",
    component: landingPage,
  },
  {
    // Landing Page Arabic:
    path: "/ar/",
    component: landingPage,
  },
  {
    // Articles page:
    path: "/ar/general/:articleSlug/",
    component: lazy(() => import("./components/Ar/General-Events.js")),
  },
  {
    // General page:
    path: "/ar/general/",
    component: lazy(() => import("./components/Ar/General.js")),
  },
  {
    // Countries page:
    path: "/ar/countries/:countryCode/",
    component: lazy(() => import("./components/Ar/countries/Cards.js")),
  },
  {
    // Country Articles page:
    path: "/ar/countries/:countryCode/:url",
    component: lazy(() => import("./components/Ar/countries/Countries-Events.js")),
  },
];
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  // const location = useLocation();
  // const currentLanguage = location.pathname.includes("/en/") ? "en" : "ar";

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {/* {currentLanguage === "ar" ? <Header /> : <HeaderEN />} */}
      <Header />
      <div className="container">
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </div>
    </Suspense>
  );
}
export default App;