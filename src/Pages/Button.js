import { useState } from 'react'
export default function Button() {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(!clicked);
    };

    return (
        <button className={clicked ? 'clicked' : ''}
            onClick={handleClick}>

        </button>
    )
}