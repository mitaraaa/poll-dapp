import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon, Link2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import { Link, useNavigate } from "@tanstack/react-router";
import { ContractFactory } from "ethers";
import { useEffect, useState } from "react";
import contractJSON from "../../assets/Poll.json";
import arrow from "../../assets/arrow.svg";
import { Navbar, Option } from "../../components";
import { IWeb3Context, useWeb3Context } from "../../context/Web3Context";
import styles from "./style.module.scss";

interface OptionWrapper {
    id: number;
    value: string;
    option: JSX.Element;
}

const Create = () => {
    const navigate = useNavigate({ from: "/create/" });
    document.getElementsByTagName("html")[0].style.background = "#1B1B1B";

    const { state, balance } = useWeb3Context() as IWeb3Context;

    const [options, setOptions] = useState<OptionWrapper[]>([
        {
            id: 0,
            value: "",
            option: (
                <Option
                    key={0}
                    onDestroy={() => removeOption(0)}
                    onInputChange={(value) => onOptionChange(0, value)}
                />
            ),
        },
    ]);
    const [optionsCount, setOptionsCount] = useState<number>(1);

    const [name, setName] = useState<string>("");

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
    const [contractAddress, setContractAddress] = useState<string>("");

    const [loaded, setLoaded] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(contractAddress);
        setIsPopoverOpen(true);
        setTimeout(() => {
            setIsPopoverOpen(false);
        }, 1000);
    };

    useEffect(() => {
        if (!state.signer) {
            return;
        }

        setLoaded(true);
    }, [state.signer]);

    const deployContract = async () => {
        if (options.length < 1 || name === "" || !state.signer) {
            return;
        }

        setProcessing(true);

        const factory = new ContractFactory(
            contractJSON.abi,
            contractJSON.bytecode,
            state.signer
        );

        const contract = await factory.deploy(
            name,
            options.map((option) => option.value)
        );

        const tx = await contract.waitForDeployment();

        setContractAddress(tx.target.toString());
        setIsOpen(true);

        setProcessing(false);
    };

    const removeOption = (index: number) => {
        setOptions((prev) => {
            return prev.filter((optionWrapper) => optionWrapper.id !== index);
        });
    };

    const onOptionChange = (index: number, value: string) => {
        setOptions((options) => {
            return options.map((optionWrapper) => {
                if (optionWrapper.id !== index) {
                    return optionWrapper;
                }

                optionWrapper.value = value;
                return optionWrapper;
            });
        });
    };

    if (!window.ethereum) {
        navigate({ to: "/" });
    }

    if (!loaded) {
        return <main>Loading...</main>;
    }

    return (
        <main className={styles.main}>
            <Navbar address={state.address!} balance={balance!} />
            <div className={styles.container}>
                <h3>New poll</h3>
                <div className={styles.form}>
                    <span className={styles.label}>Name: </span>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Poll name..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div className={styles.options}>
                    {options.map((option) => option.option)}
                    <button
                        className={styles.add}
                        onClick={() => {
                            setOptions((options) => [
                                ...options,
                                {
                                    id: optionsCount,
                                    value: "",
                                    option: (
                                        <Option
                                            key={optionsCount}
                                            onDestroy={() =>
                                                removeOption(optionsCount)
                                            }
                                            onInputChange={(value) =>
                                                onOptionChange(
                                                    optionsCount,
                                                    value
                                                )
                                            }
                                        />
                                    ),
                                },
                            ]);
                            setOptionsCount((optionsCount) => optionsCount + 1);
                        }}
                    >
                        <PlusCircledIcon width={15} height={15} />
                        New option...
                    </button>
                </div>
                <button
                    className={"button " + styles.button}
                    onClick={() => deployContract()}
                    disabled={
                        options.length < 1 ||
                        name === "" ||
                        options.filter((option) => option.value === "").length >
                            0 ||
                        processing
                    }
                >
                    {processing ? (
                        "Processing..."
                    ) : (
                        <>
                            Create new poll
                            <img src={arrow} alt="arrow" />
                        </>
                    )}
                </button>
                <Dialog.Root open={isOpen}>
                    <Dialog.Portal>
                        <Dialog.Overlay className={styles.overlay} />
                        <Dialog.Content className={styles.dialogContent}>
                            <Dialog.Title className={styles.dialogTitle}>
                                New poll created!
                                <Dialog.Close asChild>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="link"
                                        aria-label="Close"
                                    >
                                        <Cross1Icon />
                                    </button>
                                </Dialog.Close>
                            </Dialog.Title>
                            <Dialog.Description
                                className={styles.dialogDescription}
                            >
                                Your poll is deployed on the blockchain. You can
                                now share it with your friends!
                            </Dialog.Description>
                            <div className={styles.contract}>
                                <div className={styles.address}>
                                    <Popover.Root open={isPopoverOpen}>
                                        Contract:{" "}
                                        <Popover.Trigger asChild>
                                            <span
                                                onClick={() =>
                                                    copyToClipboard()
                                                }
                                            >
                                                <Link2Icon />
                                                {contractAddress}
                                            </span>
                                        </Popover.Trigger>
                                        <Popover.Portal>
                                            <Popover.Content
                                                className={styles.popover}
                                            >
                                                <Popover.Arrow
                                                    className={styles.arrow}
                                                />
                                                Copied to clipboard!
                                            </Popover.Content>
                                        </Popover.Portal>
                                    </Popover.Root>
                                </div>
                                <Link
                                    to="/poll/$contractAddress"
                                    params={{
                                        contractAddress: contractAddress,
                                    }}
                                    className="button"
                                >
                                    Open poll
                                </Link>
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </main>
    );
};

export default Create;
