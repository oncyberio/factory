import Link from "next/link"
import styled from "styled-components";

export default function DestinationThumbnail({ destination }) {
    const {thumbnail, id, name, description, status} = destination;

    return <Container id="hero">
        <Link href={`/destinations/${id}`}>
            <a>
                <Main bg={thumbnail}>
                </Main>
                <Info>
                    <Title>
                        <h1> {name || 'Untitled'}</h1>
                        {status && <p>{status}</p>}
                    </Title>
                </Info>
            </a>
        </Link>
    </Container>
}

const Container = styled.div`
    width: 100%;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    background: #010103;

    transition: .3s;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0 5px 10px rgba(0,0,0,0.12);

    &:hover {
        transform: translateY(-2px);
        // box-shadow: rgb(0 0 0 / 25%) 0px 16px 30px;
    }
`


const Main = styled.div`
    background: #F2EFEF;
    background-image: url(${props => props.bg}), url(${props => props.bg2});
    background-size: cover;
    background-position: center;
    height: 170px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 6px 6px 0 0;

    @media (max-width: 1400px) {
        height: 160px;
    }


    @media (max-width: 1000px) {
        height: 150px;
    }


    @media (max-width: 640px) {
        flex-direction: column;

        h1 {
            margin: 20px 0;
            width: 100%;
        }
    }
`

const Info = styled.div`
    min-height: 150px;
    width: 100%;
    border-radius: 0 0 6px 6px;
    position: relative;

    display: grid;
    grid-template-columns: 1fr;
    justify-content: space-between;
    align-items: space-between;
    color: white;

    padding: 16px 24px;

    @media(max-width: 1400px) {
        padding: 14px;
    }

    @media(max-width: 1300px) {
        padding: 12px;
    }

    @media(max-width: 1300px) {
        grid-template-columns: 1fr;
        min-height: 120px;
    }
`

const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    overflow-wrap: break-word;
    width: 100%;
    position: relative;
    margin-bottom: 12px;

    h1 {
        font-size: 24px;
        font-style: italic;
        font-weight: 600;
        padding-bottom: 0;
        margin: 4px 0 8px 0;
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    p {
        font-weight: 400;
        font-size: 16px;
        margin: 8px 0;
        overflow: hidden;
        opacity: 0.8;
        text-overflow: ellipsis;
    }
    
    @media(max-width: 1300px) {
        h1 {
            font-size: 24px;
        }
        p {
            font-size: 15px;
        }
    }
`

const Editors = styled.div`
    // overflow: auto;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    max-height: 50px;
    position: relative;
`

const Next = styled.div`
    position: absolute;
    border-radius: 100%;
    padding: 8px;
    background: #343434;
    width: 40px;
    height: 40px;
    top: 56%;
    right: 2px;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        filter: invert(1);
    }

    &:hover {
        background: #000000;
    }

    @media(max-width: 800px) {
        top: 60%;
        width: 35px;
        height: 35px;
    }
`

const Countdowns = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    p {
        font-size: 16px;
        margin: 2px 0;
    }

    p span {
        font-size: 0.8em;
        color: #AEAEAE;
    }

    @media(max-width: 1300px) {
        p {
            font-size: 14px;
        }
    }
`
