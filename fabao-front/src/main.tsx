import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container } from 'semantic-ui-react';
import { StrictMode } from 'react';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Loading from '@/components/Loading';
import {
  enableAutoPageviews,
  enableAutoTrackMultiDomain,
} from './libs/plausible';

// Styles
import 'semantic-ui-css/semantic.min.css'
import './main.less';
import styles from './main.module.less';

// Pages
const Home = lazy(() => import('./pages/Home'));

const App: React.FC = () => {
  const [loadedPage, setLoadedPage] = useState(false);
  const [errorLoadingPage, setErrorLoadingPage] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setLoadedPage(true);
      } catch (e) {
        console.error(e);
        setErrorLoadingPage(true);
      }
    })();
  }, []);

  useEffect(() => enableAutoPageviews(), []);
  useEffect(() => enableAutoTrackMultiDomain(), []);

  // 加载中
  if (!loadedPage) {
    return <Loading progress={progress} />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Suspense>
  );
};


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Helmet defaultTitle="类案检索工具" titleTemplate="%s - 类案检索工具" />
      <Header />
      <Container className={styles.container}>
        <App />
      </Container>
    </BrowserRouter>
  </StrictMode>,
)
