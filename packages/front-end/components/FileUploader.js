import { useState } from 'react';
import styled from 'styled-components';

function FileUploader({ setFile, type }) {

    const handleDisplayImage = (e) => {
        if (!e.target.files[0]) return setFile("");

        var reader  = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.addEventListener("load", function () {
            if (type == 'image') {
                var image = new Image();
                image.src = reader.result;
                image.onload = function() {
                    setFile({file: reader.result, type});
                }
            }
            else {
                setFile({file: reader.result, type});
            }
        }, false);
    }

    return <Container>
        {/* <p>Click to upload</p> */}
        <input
            type="file"
            onChange={ handleDisplayImage } 
            />
    </Container>
}

const Container = styled.div`
    overflow: hidden;
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 16px;

    p {
        color: black;
        font-weight: 400;
        border-radius: 10px;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        width: 100%;

        @media(max-width: 1200px) {
            font-size: 16px;
        }
    }

    @media(max-width: 600px) {
        padding: 8px;
        text-align: center;
    }
`

export default FileUploader;