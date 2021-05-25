import { useEffect, useReducer } from "react";
import React from "react";
import Web3 from 'web3';
import { useRouter } from "next/router";

const userInitialState = {
    id: "",
}

const initialState = {
    user: userInitialState,
    authenticated: false,
    loading: true,
    userData: null,
    dispatch: () => {},
    login: () => {},
    authenticate: () => {},
    simple_authenticate: () => {},
    isFirstLogin: false,
    token: ""
}

export const UserContext = React.createContext(initialState);

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const LOADING_ENDED = "LOADING_ENDED";
export const LOADING_STARTED = "LOADING_STARTED";

const reducer = (state, action) => {
    if (action.type === USER_LOGIN) {
        return {
            ...state,
            ...action.payload
        };
    }

    if (action.type === USER_LOGOUT) {
        return {
            ...initialState,
            loading: false
        };
    }

    if (action.type === LOADING_STARTED) {
        return {
            ...state, 
            loading: true
        }
    }

    if (action.type === LOADING_ENDED) {
        return {
            ...state,
            loading: false
        }
    }

    return state;
}

export const UserProvider = ({ children }) => {
    const [ authenticationState, dispatch ] = useReducer(reducer, initialState)
    const router = useRouter();

    const login = async () => {
        try {

            dispatch({ type: USER_LOGIN, payload: {
                authenticated: true,
                loading: false,
                isFirstLogin: true
            }});

            return authenticationState.user.id;
        }
        catch(e) {
            console.log(e);
            window.open("https://metamask.io", "_blank");
        }
    }

    const simple_authenticate = async (ethereumAccountId, type = "coinbase") => {
        ethereumAccountId = ethereumAccountId;

        return fetch(`/api/user/simple_authenticate`, {
            method: 'POST',
            body: JSON.stringify({ 
                owner: ethereumAccountId,
                type
            }),
            headers: { "Content-Type": "application/json" }
        })
            .then((res) => { return res.json(); })
            .then(({ token, success, message }) => {
                
                if (success) {
                    dispatch({
                        type: USER_LOGIN,
                        payload: {
                            token
                        }
                    })
                    return { success: true, token };
                } else {
                    return { success: false, message: "Failed to authenticate."}
                }
            })
    }   

    const authenticate = async (ethereumAccountId) => {
        ethereumAccountId = ethereumAccountId;

        return new Promise((resolve, reject) => {
            if (typeof window.ethereum !== 'undefined') {

                function toHex(s) {
                    var hex = "";
                    for(var i=0;i<s.length;i++) { hex += ""+s.charCodeAt(i).toString(16); }
                    return `0x${hex}`;
                }
                
                const web3 = new Web3(Web3.givenProvider);

                var data = toHex("Welcome to Cyber! This message allows us to make your account secure.");
                
                web3.currentProvider.sendAsync(
                    { 
                        id: 1, 
                        method: 'personal_sign', 
                        params: [ethereumAccountId, data] 
                    },
                    function(err, result) {
                        let sig = result.result;

                        return fetch(`/api/user/authenticate`, {
                            method: 'POST',
                            body: JSON.stringify({ owner: ethereumAccountId, sig: sig}),
                            headers: { "Content-Type": "application/json" }
                        })
                            .then((res) => { return res.json(); })
                            .then(({ token, success, message }) => {
                                
                                if (success) {
                                    dispatch({
                                        type: USER_LOGIN,
                                        payload: {
                                            token
                                        }
                                    })
                                    resolve({ success: true, token });
                                } else {
                                    resolve({ success: false, message: "Failed to authenticate."})
                                }
                            })
                    }
                )
            } else {
                resolve({ success: false, message: "Metamask not installed."})
            }
        })
    }


    const value = { 
        ...authenticationState,
        dispatch,
        login,
        authenticate,
        simple_authenticate
    };

    return <UserContext.Provider value={ value }>
        { children }
    </UserContext.Provider>
}