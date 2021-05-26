import { useState } from 'react';
import styled from 'styled-components';
import FileUploader from './FileUploader';
import { Button, Input, TextArea } from './Elements';
import Ipfs from 'ipfs';
import { mint } from '../utils/minter';

function Factory({token, setSuccess}) {
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [traits, setTraits] = useState({height: 10, placeholders: 30, scale: .2});
    const [ thumbnail, setThumbnail ] = useState();
    const [ destination, setDestination] = useState();
    const [ quantity, setQuantity ] = useState(20);

    const submit = async () => {
        setLoading(true);
        if (!title || !description) {
            alert("Please set title and description!")
        }
        else if (thumbnail && destination) {
            const ipfs = await Ipfs.create()
            try {
                const dest = await ipfs.add(destination);
                const thumb = await ipfs.add(thumbnail);
                console.info('Hash', dest.cid, thumb.cid);
                const {status, ipfsHashMetadata, signature} = await (await fetch('/api/generate', {
                    method: "POST",
                    body: JSON.stringify({
                      token,
                      payload: {
                        destHash: dest.cid.string,
                        thumbHash: thumb.cid.string, 
                        nonce: 0,
                        amount: quantity
                      },
                    }),
                })).json();

                if (status == 'success') {
                    const balance = await mint(ipfsHashMetadata, quantity, signature)
                    console.log(balance)
                    setSuccess(true);
                }
                else {
                    alert("Did not manage to pin hash... Try again later.")
                }
            }
            catch (e) {
                console.log(e)
                alert("There was an error while uploading your assets. Please refresh and try again")
            }

        }
        else {
            alert("Upload both a thumbnail and the 3D model")
        }
        setLoading(false);
    }


    return <Container>
        <div>
            <h4>Title</h4>
            <Input type="text" value={ title } name="title" onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
            <h4> Description </h4>
            <TextArea type="text" value={ description } name="description" onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
            <h4> Placeholders </h4>
            <Input type="number" value={ traits.placeholders } name="placeholders" onChange={(e) => setTraits({traits, ...{placeholders: e.target.value}})} />
        </div>
        {/* <div>
            <h4> Camera Height </h4>
            <TextArea type="text" name="height" onChange={(e) => setTraits({traits, ...{height: e.target.value}})} />
        </div>
        <div>
            <h4> Camera Scale </h4>
            <TextArea type="text" name="scale" onChange={(e) => setTraits({traits, ...{scale: e.target.value}})} />
        </div> */}
        <div>
            <h4> Preview (image or video) </h4>
            <FileUploader setFile={setThumbnail} />
        </div>
        <div>
            <h4> 3D Model (GLTF Embedded file) </h4>
            <FileUploader setFile={setDestination} />
        </div>
        <div>
            <Button disabled={loading} onClick={submit} purple> {loading ? 'Loading...': 'Upload'}</Button>
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

export default Factory;