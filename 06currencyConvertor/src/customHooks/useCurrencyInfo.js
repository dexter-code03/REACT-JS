import { useEffect, useState } from "react";

function useCurrencyInfo(currency) {
    const [data, setData] = useState({})  // Initialize with empty object
    
    useEffect(() => {
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
        .then((res) => res.json())  // Add parentheses here
        .then((res) => setData(res[currency]))
    }, [currency])
    
    return data;
}

export default useCurrencyInfo;