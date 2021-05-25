import { useEffect, useState, useContext } from 'react';
import Auth from '../components/Auth';

import { UserContext } from '../components/context/UserContext';


export default function Home() {
  const { user, authenticated } = useContext(UserContext);

  return !authenticated ? <Auth /> : <h1> Here should upload file, pin,  </h1>
}
