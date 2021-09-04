import { useEffect, useState, useContext } from 'react'
import Auth from '../components/Auth'

import { UserContext } from '../components/context/UserContext'
import Factory from '../components/Factory'

import styled from 'styled-components'

export default function Home() {
  const { authenticated, token } = useContext(UserContext)
  const [success, setSuccess] = useState(false)

  return !authenticated ? (
    <Auth />
  ) : (
    <Container>
      <Grid>
        {!success ? (
          <Factory setSuccess={setSuccess} token={token} />
        ) : (
          <h1>Success, finished minting! Now list your asset pls</h1>
        )}
        {/* <h1> Preview </h1> */}
      </Grid>
    </Container>
  )
}

const Container = styled.div`
  background: #111111;
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
