import { useState } from 'react';
import styled from 'styled-components';
import FileUploader from './FileUploader';
import { Button, Input, TextArea } from './Elements';
import Ipfs from 'ipfs';
import { getNonce, mint, mintForwarder } from '../utils/minter';
import config from '../config';

function Submit({destination}) {
    const [loading, setLoading] = useState(false);
    const { status, ipfsHashMetadata, signature, quantity } = destination;

    const submit = async () => {
        try {
            const contractName = config.currentContract;
            const amountOncyber = quantity * config[contractName].minOncyberShares;

            if(parseInt(amountOncyber).toString() !== amountOncyber.toString() ){
                throw new Error('invalid amount');
            }

            if (status == 'verified') {
                console.log("PIN SUCCESS")
                const balance = contractName == 'destination' ? await mint(ipfsHashMetadata, quantity, amountOncyber, signature, contractName) : await mintForwarder(ipfsHashMetadata, quantity, amountOncyber, signature, contractName);
                console.log(balance)
                setSuccess(true);
            }
            else {
                alert("Your asset has not been verified yet. We will notice you soon.")
            }
        }
        catch (e) {
            console.log(e)
            alert("There was an error while uploading your assets. Please refresh and try again")
        }
        setLoading(false);
    }


    return <Container>
        <h1> Good to go</h1>
        <button disabled={status != 'verified'} onClick={submit}>Submit Model</button>
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

export default Submit;
