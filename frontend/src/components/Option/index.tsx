import { Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import styles from "./style.module.scss";

const Option = ({ onDestroy, onInputChange }: OptionProps) => {
    const [option, setOption] = useState("");

    const onOptionChange = (value: string) => {
        setOption(value);
        onInputChange(value);
    };

    return (
        <div className={styles.option}>
            <input
                className={styles.input}
                type="text"
                placeholder="Option"
                value={option}
                onChange={(event) => onOptionChange(event.target.value)}
            />
            <Cross1Icon className={styles.remove} onClick={() => onDestroy()} />
        </div>
    );
};

interface OptionProps {
    onDestroy: () => void;
    onInputChange: (value: string) => void;
}

export default Option;
