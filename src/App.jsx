import { useEffect, useState } from 'react'
import ClickButton from "./components/ClickButton"
import Stats from "./components/Stats"
import Shop from "./components/Shop"

//upgrades formulas
const upgradesFormulas = {
    clickPower: (clickPowerCost, clickPower) => clickPowerCost + (clickPower * 5),
    autoCoins: (autoCoinsCost) => Math.floor(autoCoinsCost * 1.5)
}

//shop upgrades
const shop = [
  ["clickPower", "Click Power"], 
  ["autoCoins", "Auto Coins"]
]

export default function App() {

  //coins
  const [coins, setCoins] = useState(Number(localStorage.getItem("coins")) || 0);

  //upgrades
  const [upgrades, setUpgrades] = useState(
    localStorage.getItem("upgrades") ? JSON.parse(localStorage.getItem("upgrades")) :
    {
    clickPower: 1,
    autoCoins: 0
  })

  //upgrades cost
  const [upgradesCost, setUpgradesCost] = useState(
    localStorage.getItem("upgradesCost") ? JSON.parse(localStorage.getItem("upgradesCost")) :
    {
    clickPower: 10,
    autoCoins: 50
  })

  //click
  function handleClick() {
    setCoins((prev) => prev + upgrades.clickPower);
  }

  //buy
  function handleBuy(count, upgradeKey) {
    if (coins >= upgradesCost[upgradeKey]) {
      if (count === "one") {
        setCoins(coins - upgradesCost[upgradeKey]);
        setUpgradesCost({...upgradesCost, [upgradeKey]: upgradesFormulas[upgradeKey](upgradesCost[upgradeKey], upgrades[upgradeKey])});
        setUpgrades({...upgrades, [upgradeKey]: upgrades[upgradeKey] + 1});
      }
      if (count === "max") {
        let tempUpgrades = upgrades[upgradeKey];
        let tempCoins = coins;
        let tempUpgradesCost = upgradesCost[upgradeKey];
        while (tempCoins >= tempUpgradesCost) {
          tempCoins -= tempUpgradesCost;
          tempUpgradesCost = upgradesFormulas[upgradeKey](tempUpgradesCost, tempUpgrades);
          tempUpgrades += 1;
        }
        setCoins(tempCoins);
        setUpgradesCost({...upgradesCost, [upgradeKey]: tempUpgradesCost});
        setUpgrades({...upgrades, [upgradeKey]: tempUpgrades});
      }
    }
  }

  //reset
  function handleReset() {
    localStorage.clear();
    setCoins(0);
    setUpgrades({
    clickPower: 1,
    autoCoins: 0
  })
    setUpgradesCost( {
    clickPower: 10,
    autoCoins: 50
  })
  }

  //auto coins interval
  useEffect(() => {
    const autoClick = setInterval(() => setCoins((prev) => prev + upgrades.autoCoins), 1000);
    return () => clearInterval(autoClick);
  }, [upgrades.autoCoins]);

  //local storage
  useEffect(() => {
    localStorage.setItem("coins", coins);
    localStorage.setItem("upgrades", JSON.stringify(upgrades))
    localStorage.setItem("upgradesCost", JSON.stringify(upgradesCost))
  }, [coins, upgrades, upgradesCost])

  return (
    <>
      <ClickButton handleClick={handleClick} upgrades={upgrades}/>
      <hr/>
      <Stats coins={coins} upgrades={upgrades}/>
      <hr/>
      {shop.map((upgradeKeyTitle) => <Shop 
        key={upgradeKeyTitle}
        handleBuy={handleBuy}
        upgradesCost={upgradesCost}
        coins={coins}
        upgradeKeyTitle={upgradeKeyTitle}
        />
      )}    
      <hr/>
      <button onClick={handleReset}>Reset</button>
    </>
  )
}