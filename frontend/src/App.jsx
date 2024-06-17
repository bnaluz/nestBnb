//*packages
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
//*components
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import { getSpots } from './store/spots';
import Splash from './pages/Splash/Splash';
import SpotDetailPage from './pages/SpotDetailPage/SpotDetailPage';
import { Modal } from './context/Modal';
import CreateSpotPage from './pages/CreateSpotFormPage/CreateSpotPage';
import ManageSpotsPage from './pages/ManageSpotsPage/ManageSpotsPage';
import UpdateSpotFormPage from './pages/UpdateSpotFormPage/UpdateSpotFormPage';

const Layout = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
      <Modal />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        children: [
          {
            index: true,
            element: <Splash />,
          },
          {
            path: 'spots',
            children: [
              { path: ':spotId', element: <SpotDetailPage /> },
              { path: 'create', element: <CreateSpotPage /> },
              { path: 'user-spots', element: <ManageSpotsPage /> },
              { path: 'update', element: <UpdateSpotFormPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
