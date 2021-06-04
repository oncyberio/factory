import { useEffect, useState, useContext } from 'react';
import Auth from '../components/Auth';

import { UserContext } from '../components/context/UserContext';
import Application from '../components/Application';

import styled from 'styled-components';
import DestinationThumbnail from '../components/DestinationThumbnail';

export default function Home() {
  const { authenticated, token } = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [step, setStep ] = useState(0);

  useEffect(() => {
    if (!authenticated) {
      // router f
      setLoading(true);
      console.log("NOT AUTHENTICATED")
      //fetch destinations for current user so we can show them
      setLoading(false);
    }
  }, [authenticated])


  return authenticated ? 
  <Auth /> :
  <Container>
    <h1>Destinations</h1>
    <Grid>
      {/* destinations */}
      <DestinationThumbnail destination={{id: 10, name: 'Destination 1', thumbnail: '', description: 'description', status: 'in review'}} />
    </Grid>
  </Container>
}

const Container = styled.div`
  background: #fff;
  color: #000;
  height: 100vh;
  margin: 0;
  padding: 0;
  padding: 24px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: center;
  align-items: center;
  padding: 24px 64px;
  grid-gap: 32px;
`
