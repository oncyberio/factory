import { useState } from 'react';
import styled from 'styled-components';
import FileUploader from './FileUploader';
import { Button, Input, TextArea } from './Elements';


function Factory() {

    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [traits, setTraits] = useState({height: 10, placeholders: 30, scale: .2});
    const [ thumbnail, setThumbnail ] = useState();
    const [ destination, setDestination] = useState();

    const submit = () => {
        console.log(title, description, traits)
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
            <Button purple> Upload</Button>
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