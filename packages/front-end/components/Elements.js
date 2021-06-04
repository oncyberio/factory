import styled, { css } from "styled-components";

export const Input = styled.input`
    width: 100%;
    height: 40px;
    font-size: 16px;
    padding: 2px 10px;
    border: 1px solid #000;
    background: rgba(0, 0, 0, 0.05);
    color: #000;
    outline: none;
    transition: .2s;
    box-shadow: none !important;


    &:focus{
        border: 1px solid #610eff;
    }

    @media(max-width: 600px) {
        font-size: 14px;
    }
`

export const Select = styled.select`
    border: 2px solid #F2EEE8;
    width: 100%;
    height: 40px;
    font-size: 16px;
    padding: 2px 10px;
    background: transparent;
    color: #425466;
    outline: none;
    transition: .2s;
    box-shadow: none !important;


    &:focus{
        border: 2px solid #610eff;
    }
`

export const TextArea = styled.textarea`
    width: 100%;
    min-height: 75px;
    font-size: 16px;

    padding: 10px 15px;
    border: 1px solid #000;
    background: rgba(0, 0, 0, 0.05);
    color: #000;
    outline: none;
    transition: .2s;
    box-shadow: none !important;

    @media (max-width: 600px) {
        height: 40px;
    }

    &:focus{
        border: 1px solid #610eff;
    }
`


export const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    // margin-bottom: 20px;
    padding: 10px 24px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 18px;
    line-height: 1.133;
    text-align: center;
    user-select: none;
    appearance: none;
    cursor: pointer;
    background: #fff;
    color: black;
    ${({purple}) => purple && css`
        background-color: #610eff;
        color: #fff;
    `}
    border: 1px solid rgba(0, 0, 0, 0.1);
    transition: .2s;
    outline: none;
    height: 48px;
    overflow: hidden;
    font-weight: 400;
    cursor: pointer;
    font-family: 'Aeonik';

    img {
        width: 40px;
        margin: 0 10px 0 0px;
    }

    &:hover {
        // background: linear-gradient(270deg, rgb(255, 220, 36) 3%, rgb(255, 92, 0) 100%);
        box-shadow: rgb(0 0 0 / 25%) 0px 2px 3px;
        transform: translateY(-2px);
        // border-color: #111111;
        background: #111111;
        color: white;
    }
`

export const DeleteButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 50px;
    margin-top: -10px;
    float: right;
    // margin-bottom: 20px;
    padding: 10px 24px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 18px;
    line-height: 1.133;
    text-align: center;
    user-select: none;
    appearance: none;
    cursor: pointer;
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: #000;
    transition: .4s;
    outline: none;
    height: 48px;
    overflow: hidden;
    font-weight: 400;
    cursor: pointer;

    img {
        width: 40px;
        margin: 0 10px 0 0px;
    }

    &:hover {
        border: 1px solid red;
    }

    @media (max-width: 600px) {
        font-size: 14px;
        padding: 4px;
        height: auto;
        margin-top: 0px;

        img {
            width: 16px !important;
        }
    }
`

export const RadioGroup = styled.div`
    display: flex;
    width: 200px;
    padding: 16px;
`

export const RadioItem = styled.button`
    display: flex;
    text-align: center;
    padding: 8px 16px;
    border: 1px solid ${props => props.active ? "#111" : "#AEAEAE"};
    border-radius: 3px;
    margin-right: 10px;
    cursor: pointer;

    background: ${props => props.active ? 'black' : 'transparent'};
    color: ${props => props.active ? 'white' : 'black'};
    font-size: 18px;
    align-items: center;
    justify-content: center;

    :focus {
        outline: none;
        box-shadow: -2px 2px #333, 2px 2px #333, 2px -2px #333, -2px -2px #333;
        border: 1px solid #333;
    }

    img {
        max-width: 20px;
        max-height: 20px;
        margin-right: 8px;
    }


    @media(max-width: 1100px) {
        font-size: 18px;
        padding: 10px;

    }

    @media(max-width: 640px) {
            font-size: 13px;
            padding: 10px 10px;

            .hiddenMobile {
                display: none
            }

            img {
                width: 24px;
            }
    }
`
