import { PersonIcon } from "@radix-ui/react-icons";
import styles from "./style.module.scss";

const VoteOption = (props: VoteOptionProps) => {
    return (
        <div
            className={
                styles.option +
                (props.selected ? " " + styles.selected : "") +
                (props.hasVoted ? " " + styles.hasVoted : "")
            }
            onClick={props.onClick}
        >
            <h3>{props.name}</h3>
            <span
                className={styles.votes}
                style={
                    props.hasVoted
                        ? { visibility: "visible" }
                        : { visibility: "hidden" }
                }
            >
                <PersonIcon />
                {props.voteCount}
            </span>
            <div
                className={
                    styles.bar + (props.mostVoted ? " " + styles.mostVoted : "")
                }
                style={
                    props.hasVoted
                        ? {
                              width: `${props.percentage * 100}%`,
                          }
                        : {}
                }
            ></div>
        </div>
    );
};

interface VoteOptionProps {
    id: bigint;
    name: string;
    voteCount: number;
    percentage: number;
    hasVoted: boolean;
    selected: boolean;
    onClick: () => void;
    mostVoted: boolean;
}

export default VoteOption;
