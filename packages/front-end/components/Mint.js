import { useState } from 'react';
import styled from 'styled-components';
import FileUploader from './FileUploader';
import { Button, Input, TextArea } from './Elements';
import Ipfs from 'ipfs';
import { getNonce, mint } from '../utils/minter';

function Mint({token, destination, setStep}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);


    const {ipfsHashMetadata, quantity, signature} = destination;

    const submit = async () => {
        setLoading(true);
        try {
            const balance = await mint(ipfsHashMetadata, quantity, signature)
            console.log(balance)
            setSuccess(true);
            setStep(0);
        }
        catch(e) {
            console.log(e)
            setSuccess(false);
            alert(e);
        }
        setLoading(false);
    }


    return <Container>
        <p> Your item has been verified </p>
        <div>
            <Button disabled={loading} onClick={submit} purple> {loading ? 'Loading...': 'Mint Now'}</Button>
        </div>
    </Container>
}

const Container = styled.div`
    height: 100%;
    text-align: left;
    & > div {
        padding: 8px 0;

        & > h4 {
            margin: 0 0 8px 0;
        }
    }
`

export default Mint;