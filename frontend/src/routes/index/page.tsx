import {
    ExternalLinkIcon,
    GitHubLogoIcon,
    LockClosedIcon,
} from "@radix-ui/react-icons";
import styles from "./style.module.scss";

import { Link } from "@tanstack/react-router";

import { Account } from "../../components";
import { IWeb3Context, useWeb3Context } from "../../context/Web3Context";

import { useState } from "react";
import arrow from "../../assets/arrow.svg";
import metamaskIcon from "../../assets/metamask.png";
import starBigIcon from "../../assets/star_big.svg";

const Index = () => {
    document.getElementsByTagName("html")[0].style.background =
        "radial-gradient(153.76% 120.75% at -30.21% 2.64%, rgb(255 225 68 / 20%) 0%, rgb(150 68 255 / 0%) 100%), radial-gradient(159.7% 121.12% at 86.6% 5.08%, rgb(150 68 255 / 20%) 0%, rgb(150 68 255 / 0%) 100%), #121212";

    const { connectWallet, state, balance } = useWeb3Context() as IWeb3Context;
    const [address, setAddress] = useState<string>("");

    const getFooter = () => {
        if (!state.isAuthenticated) {
            return (
                <a href="https://metamask.io" className="link">
                    <ExternalLinkIcon />
                    About Metamask
                </a>
            );
        }

        return <Account balance={balance!} address={state.address!} />;
    };

    const getButton = () => {
        if (!window.ethereum) {
            return (
                <button className="button" disabled>
                    <LockClosedIcon />
                    Install Metamask first
                </button>
            );
        }

        if (!state.isAuthenticated) {
            return (
                <button className="button" onClick={connectWallet}>
                    <img src={metamaskIcon} alt="Metamask" />
                    Connect to Metamask
                </button>
            );
        }

        return (
            <Link className="button" to="/create/">
                Create new poll
                <img src={arrow} />
            </Link>
        );
    };

    return (
        <main className={styles.main}>
            <a
                href="https://github.com/mitaraaa"
                className="link"
                style={{ position: "absolute", top: "40px", right: "40px" }}
            >
                <GitHubLogoIcon />
                Github
            </a>
            <div className={styles.finder}>
                <input
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Find poll by address"
                    required
                />
                <Link
                    className="button"
                    to={"/poll/$contractAddress"}
                    params={{ contractAddress: address }}
                >
                    Find
                </Link>
            </div>

            <div className={styles.content}>
                <img src={starBigIcon} alt="Logo" />
                <header>
                    <h1 className={styles.title}>
                        Your <span className={styles.highlighted}>opinion</span>{" "}
                        matters.
                    </h1>
                    <h3 className={styles.subtitle}>
                        Create and share your polls, now with the power of Web
                        3.
                    </h3>
                </header>
                {getButton()}
            </div>

            {getFooter()}
        </main>
    );
};

export default Index;
