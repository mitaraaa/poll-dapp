import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

declare global {
    interface Window {
        ethereum: any;
    }
}

export interface IWeb3State {
    address: string | null;
    currentChain: number | null;
    signer: JsonRpcSigner | null;
    provider: BrowserProvider | null;
    isAuthenticated: boolean;
}

const useWeb3Provider = () => {
    const initialWeb3State: IWeb3State = {
        address: null,
        currentChain: null,
        signer: null,
        provider: null,
        isAuthenticated: false,
    };

    const [balance, setBalance] = useState<string>("-");
    const [state, setState] = useState<IWeb3State>(initialWeb3State);

    const connectWallet = useCallback(async () => {
        if (state.isAuthenticated) return;

        try {
            const { ethereum } = window;

            if (!ethereum) {
                return;
            }

            const provider = new ethers.BrowserProvider(ethereum);

            const accounts: string[] = await provider.send(
                "eth_requestAccounts",
                []
            );

            if (accounts.length > 0) {
                const signer = await provider.getSigner();
                const chain = Number(
                    await (
                        await provider.getNetwork()
                    ).chainId
                );

                setState({
                    ...state,
                    address: accounts[0],
                    signer,
                    currentChain: chain,
                    provider,
                    isAuthenticated: true,
                });

                localStorage.setItem("isAuthenticated", "true");
            }
        } catch (error) {
            console.error(error);
        }
    }, [state]);

    const disconnect = () => {
        setState(initialWeb3State);
        localStorage.removeItem("isAuthenticated");
    };

    useEffect(() => {
        if (window == null) return;

        if (localStorage.hasOwnProperty("isAuthenticated")) {
            connectWallet();
        }
    }, [connectWallet, state.isAuthenticated]);

    useEffect(() => {
        if (!state.isAuthenticated) return;

        state.provider?.getBalance(state.address!).then((balanceInWei) => {
            setBalance(ethers.formatEther(balanceInWei!));
        });
    }, [state.isAuthenticated]);

    useEffect(() => {
        if (typeof window.ethereum === "undefined") return;

        window.ethereum.on("accountsChanged", (accounts: string[]) => {
            setState({ ...state, address: accounts[0] });
            location.reload();
        });

        window.ethereum.on("networkChanged", (network: string) => {
            setState({ ...state, currentChain: Number(network) });
            location.reload();
        });

        return () => {
            window.ethereum.removeAllListeners();
        };
    }, [state]);

    return { connectWallet, disconnect, state, balance };
};

export default useWeb3Provider;
