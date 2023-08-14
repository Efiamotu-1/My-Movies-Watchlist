import { useEffect, useState } from "react";

export default function App() {
  return <Values />;
}

function Values() {
  const [amount, setAmount] = useState(1);
  const [fromCur, setFromCur] = useState("EUR");
  const [toCur, setToCur] = useState("USD");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(
    function () {
      async function convert() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`
          );
          // Handling Errors
          // if (res.status === 404) throw new Error("currency does not exist");
          if (!res.ok) {
            throw new Error(
              "The link is broken or incorrect or your network is down"
            );
          }
          const data = await res.json();
          console.log(data);
          // if (data.message === "not found")
          //   throw new Error("currency does not exist");
          setOutput(data.rates[toCur]);
          setIsLoading(false);
        } catch (err) {
          console.error(err.message);
          setErrorMessage(err.message);
        }
      }

      if (fromCur === toCur) return setOutput(amount);
      convert();
    },
    [amount, fromCur, toCur]
  );
  return (
    <>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        disabled={isLoading}
      />
      <select value={fromCur} onChange={(e) => setFromCur(e.target.value)}>
        <option value="USD">USD</option>
        <option value="GBP">GBP</option>
        <option value="EUR">EUR</option>
        <option value="INR">INR</option>
      </select>
      <select value={toCur} onChange={(e) => setToCur(e.target.value)}>
        <option value="USD">USD</option>
        <option value="GBP">GBP</option>
        <option value="EUR">EUR</option>
        <option value="INR">INR</option>
      </select>

      <p>{isLoading ? "...LOADING" : `${output} ${toCur}`}</p>
      <p>{errorMessage && errorMessage}</p>
    </>
  );
}
