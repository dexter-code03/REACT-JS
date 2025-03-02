import { useState } from 'react'
import InputBox from './components/InputBox'
import useCurrencyInfo from './customHooks/useCurrencyInfo'

function App() {
  const [amount, setAmount] = useState(0)
  const [from, setFrom] = useState("usd")
  const [to, setTo] = useState("inr")
  const [convertedAmount, setConvertedAmount] = useState(0)
  const currencyInfo = useCurrencyInfo(from)
  const options = Object.keys(currencyInfo)

  const swap = () => {
    const tempAmount = amount;
    const tempFrom = from;
    
    setFrom(to);
    setTo(tempFrom);
    setAmount(convertedAmount);
    setConvertedAmount(tempAmount);
    
    setTimeout(() => {
      convert();
    }, 0);
  }
  
  const convert = () => {
    setConvertedAmount(amount * currencyInfo[to])
  }

  
  return (
    <div className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
      style={{backgroundImage:`url('https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`}}
    >
      <div className="w-full" >
        <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">
          <form
              onSubmit={(e) => {
                e.preventDefault();
                convert()
              }}
          > 
            <div className="w-full mb-1">
              <InputBox 
                  label="From"
                  currencyOptions={options}
                  selectCurrency={from}
                  amount={amount}
                  onAmountChange={(amount)=> setAmount(amount)}
                  onCurrencyChange={(currency)=> setFrom(currency)}
              />
            </div>
            <div className="relative w-full h-0.5">
              <button className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
              onClick={swap}
              >
                Swap
              </button>
            </div>
            <div className="w-full mt-1 mb-4">
              <InputBox
                  label="To"
                  currencyOptions={options}
                  selectCurrency={to}
                  amount={convertedAmount}
                  onCurrencyChange={(currency)=>setTo(currency)}
                  amountDisabled
              />
            </div>
            <button type='Submit' className=' w-full max-w-md bg-blue-600 rounded-lg p-2 text-m'>
              Convert {from.toUpperCase()} to {to.toUpperCase()}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
