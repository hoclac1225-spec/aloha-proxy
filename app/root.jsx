import React from 'react';
import {Outlet} from 'react-router-dom';
import { AppProviderFix } from './utils/AppProviderFix';


export default function App() {
  return (
    <AppProviderFix>
      <Outlet />
    </AppProviderFix>
  );
}
