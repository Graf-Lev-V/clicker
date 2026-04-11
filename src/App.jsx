import { useEffect, useState } from 'react'
import ClickButton from "./components/ClickButton"
import Stats from "./components/Stats"
import Shop from "./components/Shop"

export default function App() {
  
  const [coins, setCoins] = useState(Number(localStorage.getItem("coins")) || 0);
  const [clickPower, setClickPower] = useState(Number(localStorage.getItem("clickPower")) || 1);
  const [upgradeClickPowerCost, setUpgradeClickPowerCost] = useState(Number(localStorage.getItem("upgradeClickPowerCost")) || 10);
  const [autoCoin, setAutoCoin] = useState(Number(localStorage.getItem("autoCoin")) || 0)
  const [upgradeAutoCoinCost, setUpgradeAutoCoinCost] = useState(Number(localStorage.getItem("upgradeAutoCoinCost")) || 50)

  function handleClick() {
    setCoins(coins + clickPower);
  }
  function handleBuyClickPower(value) {
    if (coins >= upgradeClickPowerCost) {
      if (value === "Buy") {
        setCoins(coins - upgradeClickPowerCost);
        setUpgradeClickPowerCost(upgradeClickPowerCost + (clickPower * 5));
        setClickPower(clickPower + 1);
      }
      if (value === "Buy max") {
        let tempClickPower = clickPower;
        let tempCoins = coins;
        let tempUpgradeCost = upgradeClickPowerCost;
        while (tempCoins >= tempUpgradeCost) {
          tempCoins -= tempUpgradeCost;
          tempUpgradeCost = tempUpgradeCost + (tempClickPower * 5);
          tempClickPower += 1;
        }
        setCoins(tempCoins);
        setUpgradeClickPowerCost(tempUpgradeCost);
        setClickPower(tempClickPower);
      }
    }
    return;
  }
  function handleBuyAutoCoin(value) {
     if (coins >= upgradeAutoCoinCost) {
      if (value === "Buy") {
        setCoins(coins - upgradeAutoCoinCost);
        setUpgradeAutoCoinCost(Math.floor(upgradeAutoCoinCost * 1.5));
        setAutoCoin(autoCoin + 1);
      }
      if (value === "Buy max") {
        let tempAutoCoin = autoCoin;
        let tempCoins = coins;
        let tempUpgradeCost = upgradeAutoCoinCost;
        while (tempCoins >= tempUpgradeCost) {
          tempCoins -= tempUpgradeCost;
          tempUpgradeCost = Math.floor(tempUpgradeCost * 1.5);
          tempAutoCoin += 1;
        }
        setCoins(tempCoins);
        setUpgradeAutoCoinCost(tempUpgradeCost);
        setAutoCoin(tempAutoCoin);
      }
    }
    return;
  }

  useEffect(() => {
    const autoClick = setInterval(() => setCoins((prev) => prev + autoCoin), 1000);
    return () => clearInterval(autoClick);
  }, [autoCoin]);
  useEffect(() => {
    localStorage.setItem("coins", coins);
    localStorage.setItem("clickPower", clickPower);
    localStorage.setItem("upgradeClickPowerCost", upgradeClickPowerCost);
    localStorage.setItem("autoCoin", autoCoin);
    localStorage.setItem("upgradeAutoCoinCost", upgradeAutoCoinCost);
  }, [coins, clickPower, upgradeClickPowerCost, autoCoin, upgradeAutoCoinCost])

  function handleReset() {
    localStorage.clear();
    setCoins(0);
    setClickPower(1);
    setUpgradeClickPowerCost(10);
    setAutoCoin(0);
    setUpgradeAutoCoinCost(50);
  }

  return (
    <>
      <ClickButton handleClick={handleClick} clickPower={clickPower}/>
      <hr/>
      <Stats coins={coins} clickPower={clickPower} autoCoin={autoCoin}/>
      <hr/>
      <Shop 
      handleBuyClickPower={handleBuyClickPower} 
      upgradeClickPowerCost={upgradeClickPowerCost} 
      handleBuyAutoCoin={handleBuyAutoCoin} 
      upgradeAutoCoinCost={upgradeAutoCoinCost}
      coins={coins}
      />
      <hr/>
      <button onClick={handleReset}>Reset</button>
    </>
  )
}

