import {Button, LinkButton, NormalButton} from './Elements';
import WalletConnect from "@walletconnect/client";
import WalletLink from "walletlink";
import Fortmatic from "fortmatic";
import Web3 from "web3";
import { useContext, useState } from "react";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { UserContext } from "./context/UserContext";

import { USER_LOGIN } from "./context/UserContext";
import styled from "styled-components";
import Spinner from "./Spinner";

function Authentication({ isShowing, toggle, className }) {
    const [ loading, setLoading ] = useState(false);
    const { authenticate, simple_authenticate, dispatch } = useContext(UserContext);

    async function authenticateAfterConnect(ethereumAccountId, isSimpleAuth) {
        if (ethereumAccountId.indexOf("0x") === 0) {
            ethereumAccountId = ethereumAccountId.toLowerCase();
        }

        if (isSimpleAuth) {
            var { success, token, message } = await simple_authenticate(ethereumAccountId, "coinbase");
        }
        else {
            var { success, token, message } = await authenticate(ethereumAccountId);
        }

        if (!success) {
            return console.log("COULD NOT AUTHENTICATE")
        }
        
        dispatch({ type: USER_LOGIN, payload: {
            user: { id: ethereumAccountId },
            ethereum: ethereum,
            authenticated: true,
            token
        }});
        console.log("DONE")
    }

    async function formaticConnect() {
        try {
            setLoading(true); 
            let fm = new Fortmatic('pk_live_F95FEECB1BE324B5');
            const web3 = new Web3(fm.getProvider());
            const [ ethereumAccountId ] = await web3.eth.getAccounts();
            await authenticateAfterConnect(ethereumAccountId, true);
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }


    async function walletConnect() {
        setLoading(true);
        const bridge = "https://bridge.walletconnect.org";

        const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
         // check if already connected
        if (!connector.connected) {
            // create new session
            await connector.createSession();
        } else {
            const { chainId, accounts } = connector;
            const [ ethereumAccountId ] = accounts;
            await authenticateAfterConnect(ethereumAccountId, true);
            setLoading(false);
        }
        
        
        connector.on("connect", async (error, payload) => {
            const [ ethereumAccountId ] = payload.params[0].accounts;
            await authenticateAfterConnect(ethereumAccountId, true);
            setLoading(false);
        });
    }

    async function connectWalletLink() {
        try {
            setLoading(true);
            const walletLink = new WalletLink({
                appName: "Cyber",
                appLogoUrl: "https://oncyber.io/images/logo-black.png",
                darkMode: "false"
            })
    
            const ethereum = walletLink.makeWeb3Provider("https://mainnet.infura.io/v3/85785677004c47b2b33a41a174e1a775", 1)
            const ethereumAccountId = (await ethereum.enable())[0];
            await authenticateAfterConnect(ethereumAccountId, true);

            return {ethereum, ethereumAccountId};
        } catch(err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    
    async function connectMetamask() {
        if (typeof window.ethereum !== 'undefined') {
            setLoading(true);
            const ethereumAccountId = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
            await authenticateAfterConnect(ethereumAccountId);
            setLoading(false);

            return { ethereum, ethereumAccountId };
        }
    }


    return <div className={className}>
        {loading
            ? <Spinner />
            : <>
                <h2>In order to mint your new room, first connect your wallet</h2>
                <Button disabled={ loading }  onClick={(e) => connectMetamask()}>
                <img style={{width: '38px'}} src='../images/icons/metamask.png'/>
                <span>{loading ? 'Loading...' : 'Metamask'}</span>
            </Button>

            {/* <Button disabled={ loading }  onClick={(e) => connectWalletLink()}>
                <img style={{width: '30px', marginLeft: '2px'}} src='../images/icons/coinbase.svg'/>
                <span>{loading ? 'Loading...' : 'Coinbase Mobile'}</span>
            </Button> */}

            <Button disabled={ loading }  onClick={(e) => walletConnect()}>
                <img style={{width: '34px'}} src='../images/icons/walletconnect.png'/>
                <span>{loading ? 'Loading...' : 'WalletConnect (Trust)'}</span>
            </Button>
            
            <Button disabled={ loading }  onClick={(e) => formaticConnect()}>
                <img style={{width: '32px'}} src='../images/icons/fortmatic.png'/>
                <span>{loading  ? 'Loading...' : 'Fortmatic'}</span>
            </Button>
            </>}
    </div>
}

export default styled(Authentication)`
    height: 500px;
    width: 100%;
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;


    h2 {
        margin: 24px 0 0 0;
    }


    & > p {
        margin: 0 0;
        font-size: 14px;
        opacity: 0.6;
    }

    & > button {
        position: relative;
        display: flex;
        margin: 8px 0;
        font-size: 16px;
        align-items: center;
        
        margin-bottom: 0px;
        img {
            position: absolute;
            left: 20px;
            top: 8px;
        }
    }

    // & .btn {
    //     border-radius: 16px;
    //     border: 2px solid #111;
    //     justify-content: space-between;
    //     height: 60px;
    // }
`;