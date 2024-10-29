import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/common/Header.js";
import { LoadingSpinner } from "./components/common/LoadingSpinner.js";
import Footer from "./components/common/Footer.js";
const landingPage = lazy(() => import("./components/Ar/LandingPageAR.js"));
const contactUs = lazy(() => import("./components/Ar/Contact-us.js"));
const aboutUs = lazy(() => import("./components/Ar/About.js"));
const privacyPolicy = lazy(() => import("./components/Ar/Privacy.js"));
const routes = [
  {
    // Landing Page Arabic:
    path: "/",
    component: landingPage,
  },
  {
    path: "عن_مواعيد",
    component: aboutUs,
  },
  {
    path: "اتصل_بنا",
    component: contactUs,
  },
  {
    path: "الخصوصية",
    component: privacyPolicy,
  },

  {
    // Articles page:
    path: "/:articleSlug/",
    component: lazy(() => import("./components/Ar/General/General-Events.js")),
  },
  {
    // General page:
    path: "/مناسبات_عامة/",
    component: lazy(() => import("./components/Ar/General/GeneralList.js")),
  },
  {
    // Countries page:
    path: "/countries/:countryCode/جميع_المناسبات/",
    component: lazy(() => import("./components/Ar/countries/CountresList.js")),
  },
  {
    // Country Articles page:
    path: "/countries/:countryCode/:url/",
    component: lazy(() =>
      import("./components/Ar/countries/Countries-Events.js")
    ),
  },
  {
    // Search Results page:
    path: "/search-results/",
    component: lazy(() => import("./components/common/SearchResults.js")),
  },
  {
    // Holidays Table page:
    path: "/countries/:countryCode/العطل_القادمة/",
    component: lazy(() => import("./components/Ar/countries/HolidayTable.js")),
  },
  {
    // Create Countdown page:
    path: "/انشاء_عد_تنازلي/",
    component: lazy(() => import("./components/common/createCountdown.js")),
  },
  {
    // Admin dashboard page:
    path: "/admin/",
    component: lazy(() => import("./components/Admin/AdminPanel.js")),
  },
  {
    // Admin Login page:
    path: "/login/",
    component: lazy(() => import("./components/Admin/AdminLogin.js")),
  },
  {
    // Created Countdown page:
    path: "/countdown/:countdownId/",
    component: lazy(() => import("./components/common/Countdown.js")),
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
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/admin");
  // const currentLanguage = location.pathname.includes("/en/") ? "en" : "ar";

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {/* {currentLanguage === "ar" ? <Header /> : <HeaderEN />} */}
      <Header />
      <div
        className="container"
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div style={{ flex: "1" }}>
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
      </div>
      {!hideFooter && <Footer />}
    </Suspense>
  );
}
export default App;