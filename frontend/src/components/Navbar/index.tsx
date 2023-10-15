import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { Account } from "..";
import star from "../../assets/star.svg";
import styles from "./style.module.scss";

const Navbar = (props: NavbarProps) => {
    return (
        <nav className={styles.navbar}>
            <section className={styles.section}>
                <Link to="/">
                    <img src={star} alt="Logo" />
                </Link>
                <a href="https://github.com/mitaraaa" className="link">
                    <GitHubLogoIcon />
                    Github
                </a>
            </section>
            <Account balance={props.balance!} address={props.address!} />
        </nav>
    );
};

interface NavbarProps {
    balance: string;
    address: string;
}

export default Navbar;
