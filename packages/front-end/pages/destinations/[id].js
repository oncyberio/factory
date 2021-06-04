import { useEffect, useState, useContext } from 'react';

import Auth from '../../components/Auth';
import { UserContext } from '../../components/context/UserContext';
import Application from '../../components/Application';
import Mint from '../../components/Mint';
import Submitted from '../../components/Submitted';

import styled from 'styled-components';


export default function Destination({destination}) {
  const { authenticated, token, user } = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [step, setStep ] = useState(destination.step);

  useEffect(() => {
    if (!authenticated || destination.creator != user.id) {
      setLoading(false);
      // get out now
    }
    else {
        console.log("not him...")
        // router go back to unauthenticated mode
    }
  }, [])


  return authenticated ? 
  <Auth /> :
  <Container>
    <Grid>
      {loading ? 
      <p>Loading...</p> : 
        ( (!destination.status || destination.status == 'rejected') && <Application setSuccess={setSuccess} token={token} setStep={setStep}/>)
        || (destination.status == 'submitted' && <Submitted destination={destination}/>)
        || (destination.status == 'veified' && <Mint destination={destination} token={token} />)      
      }
      {/* <h1> Preview </h1> */}
    </Grid>
  </Container>
}

export const getServerSideProps = async ({query}) => {  
    var data = {}
  
    try {
      const response = await fetch(`${ process.env.CYBER_API }/api/destinations?id=${query.id}`);
  
      data = await response.json();
    }
    catch (e) {
      console.log(e)
    }
    return {
      props: {
        destination: data?.destination || {}
      }
    }
  };

const Container = styled.div`
  color: white;
  height: 100vh;
  text-align: center;
  margin: 0;
  padding: 0;
`

const Grid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 64px;
  grid-gap: 32px;
`