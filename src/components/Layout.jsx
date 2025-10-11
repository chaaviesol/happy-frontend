import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingNewSOButton from './FloatingNewSOButton';

export default function Layout() {
  return (
    <main className='App'>
        <Outlet/>
        <FloatingNewSOButton />
  </main>
  )
}
