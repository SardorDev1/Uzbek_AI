import React, { useState } from 'react'

export default function SendTextMessage(props) {
    const [MessageSendtoGpt, setMessageSendtoGpt] = useState('');
    const handleChange = (event) => {
        setMessageSendtoGpt(event.target.value);
    };

    const handleSearch = () => {
        props.onSearch(MessageSendtoGpt); // AccountComponent ga ma'lumot yuborish
    };
    return (
        <>
            <input type="text" value={searchText} onChange={handleChange} />
            <div>SendTextMessage</div>
            <button onClick={handleSearch}>Click</button>
        </>


    )
}
