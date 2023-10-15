import { Link2Icon, PersonIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import styles from "./style.module.scss";

const formatAddress = (address: string): string => {
    return `${address.slice(0, 7)}...${address.slice(-5)}`;
};

const Account = (props: AccountProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(props.address);
        setIsOpen(true);
        setTimeout(() => {
            setIsOpen(false);
        }, 1000);
    };

    return (
        <Popover.Root open={isOpen}>
            <div className={styles.account}>
                <PersonIcon />
                <section>
                    <span className={styles.balance}>{props.balance} tBNB</span>
                    <Popover.Trigger asChild>
                        <span
                            className={styles.address}
                            onClick={() => copyToClipboard()}
                        >
                            <Link2Icon />
                            {formatAddress(props.address)}
                        </span>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content className={styles.popover}>
                            <Popover.Arrow className={styles.arrow} />
                            Copied to clipboard!
                        </Popover.Content>
                    </Popover.Portal>
                </section>
            </div>
        </Popover.Root>
    );
};

interface AccountProps {
    balance: string;
    address: string;
}

export default Account;
