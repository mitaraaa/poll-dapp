import { createContext, FC, ReactNode, useContext } from "react";
import useWeb3Provider, { IWeb3State } from "../hooks/useWeb3Provider";

export interface IWeb3Context {
    connectWallet: () => Promise<void>;
    disconnect: () => void;
    state: IWeb3State;
    balance: string | null;
}

const Web3Context = createContext<IWeb3Context | null>(null);

type Props = {
    children: ReactNode;
};

const Web3ContextProvider: FC<Props> = ({ children }) => {
    const { connectWallet, disconnect, state, balance } = useWeb3Provider();

    return (
        <Web3Context.Provider
            value={{
                connectWallet,
                disconnect,
                state,
                balance,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};

export default Web3ContextProvider;

export const useWeb3Context = () => useContext(Web3Context);