import {
    LockClosedIcon,
    LockOpen1Icon,
    PersonIcon,
} from "@radix-ui/react-icons";
import { Link, useParams } from "@tanstack/react-router";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractJSON from "../../assets/Poll.json";
import { Navbar, VoteOption } from "../../components";
import { IWeb3Context, useWeb3Context } from "../../context/Web3Context";
import styles from "./style.module.scss";

interface IOption {
    id: bigint;
    name: string;
    voteCount: bigint;
}

const Poll = () => {
    document.getElementsByTagName("html")[0].style.background = "#1B1B1B";

    const { contractAddress } = useParams({ from: "/poll/$contractAddress" });
    const { state, balance } = useWeb3Context() as IWeb3Context;

    const [contract, setContract] = useState<Contract | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [name, setName] = useState("");
    const [totalVotes, setTotalVotes] = useState(0n);
    const [options, setOptions] = useState<IOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<bigint | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [waitingForTransaction, setWaitingForTransaction] = useState(false);
    const [invalidAddress, setInvalidAddress] = useState(false);
    const [address, setAddress] = useState<string>("");

    useEffect(() => {
        if (!state.signer) {
            return;
        }

        setLoaded(true);
    }, [state.signer]);

    useEffect(() => {
        if (!state.signer) {
            return;
        }

        if (!ethers.isAddress(contractAddress)) {
            setInvalidAddress(true);
            return;
        }

        const contract = new Contract(
            contractAddress,
            contractJSON.abi,
            state.signer
        );

        setContract(contract);

        contract.getOwner().then((owner: string) => {
            setIsOwner(owner.toLowerCase() === state.address?.toLowerCase());
        });
        contract.hasVoted().then((hasVoted: boolean) => setHasVoted(hasVoted));
        contract.getName().then((name: string) => setName(name));
        contract
            .getTotalVotes()
            .then((totalVotes: bigint) => setTotalVotes(totalVotes));
        contract.isClosed().then((isClosed: boolean) => setIsClosed(isClosed));

        contract.getOptions().then((options: any[]) =>
            setOptions(
                options.map((option: any[]) => {
                    return {
                        id: option[0],
                        name: option[1],
                        voteCount: option[2],
                    } as IOption;
                })
            )
        );
    }, [state.signer]);

    const castVote = async () => {
        if (!state.signer || selectedOption === null || !contract) {
            return;
        }

        await contract.castVote(selectedOption);
        setWaitingForTransaction(true);

        await contract.once("VoteCast", async () => {
            setWaitingForTransaction(false);
            setHasVoted(await contract.hasVoted());
            setTotalVotes(await contract.getTotalVotes());
            setOptions(
                (await contract.getOptions()).map((option: any[]) => {
                    return {
                        id: option[0],
                        name: option[1],
                        voteCount: option[2],
                    } as IOption;
                })
            );
        });
    };

    const closePoll = async () => {
        if (!state.signer || !contract || !isOwner) {
            return;
        }

        await contract.closePoll();
        setIsClosed(true);
    };

    if (!loaded) {
        return <div>Loading...</div>;
    }

    if (invalidAddress) {
        return (
            <main className={styles.main}>
                <Navbar address={state.address!} balance={balance!} />
                <section className={styles.content}>
                    <h2 style={{ margin: "0" }}>Invalid address</h2>
                    <p style={{ margin: "0" }}>
                        The address you entered is not a valid contract address.
                    </p>
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
                </section>
                <footer></footer>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <Navbar address={state.address!} balance={balance!} />
            <section className={styles.content}>
                <h1>{name}</h1>
                <div className={styles.poll}>
                    {options.map((option: IOption) => (
                        <VoteOption
                            id={option.id}
                            key={option.id}
                            name={option.name}
                            hasVoted={hasVoted || isClosed}
                            selected={selectedOption === option.id}
                            onClick={() =>
                                !hasVoted &&
                                !isClosed &&
                                setSelectedOption(option.id)
                            }
                            voteCount={Number(option.voteCount)}
                            percentage={
                                Number(option.voteCount) / Number(totalVotes)
                            }
                            mostVoted={
                                options
                                    .map((option) => option.voteCount)
                                    .reduce((a, b) => (a > b ? a : b), 0n) ===
                                option.voteCount
                            }
                        />
                    ))}
                </div>
                <button
                    className={"button " + styles.vote}
                    onClick={() => castVote()}
                    disabled={hasVoted || waitingForTransaction}
                    style={isClosed ? { visibility: "hidden" } : {}}
                >
                    {waitingForTransaction ? "Processing..." : "Vote"}
                </button>
                <button
                    className={"link " + styles.close}
                    style={
                        isOwner && !isClosed
                            ? { visibility: "visible" }
                            : { visibility: "hidden" }
                    }
                    onClick={() => closePoll()}
                >
                    <LockOpen1Icon />
                    Close poll
                </button>
            </section>
            <footer>
                <span className={styles.voted}>
                    <PersonIcon />
                    {Number(totalVotes)} voted
                </span>
                {isClosed ? (
                    <span className={styles.closed}>
                        <LockClosedIcon />
                        Poll is closed
                    </span>
                ) : null}
            </footer>
        </main>
    );
};

export default Poll;
