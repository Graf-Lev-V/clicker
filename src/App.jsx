import { useEffect, useState } from 'react'
import ClickButton from "./components/ClickButton"
import Stats from "./components/Stats"
import Shop from "./components/Shop"

const upgradesFormulas = {
    clickPower: (clickPowerCost, clickPower) => clickPowerCost + (clickPower * 5),
    autoCoins: (autoCoinsCost) => Math.floor(autoCoinsCost * 1.5)
  }

export default function App() {

  const [coins, setCoins] = useState(Number(localStorage.getItem("coins")) || 0);
  const [upgrades, setUpgrades] = useState(
    localStorage.getItem("upgrades") ? JSON.parse(localStorage.getItem("upgrades")) :
    {
    clickPower: 1,
    autoCoins: 0
  })
  const [upgradesCost, setUpgradesCost] = useState(
    localStorage.getItem("upgradesCost") ? JSON.parse(localStorage.getItem("upgradesCost")) :
    {
    clickPower: 10,
    autoCoins: 50
  })

  function handleClick() {
    setCoins(coins + upgrades.clickPower);
  }
  function handleBuy(type, value) {
    if (coins >= upgradesCost[value]) {
      if (type === "Buy") {
        setCoins(coins - upgradesCost[value]);
        setUpgradesCost({...upgradesCost, [value]: upgradesFormulas[value](upgradesCost[value], upgrades[value])});
        setUpgrades({...upgrades, [value]: upgrades[value] + 1});
      }
      if (type === "Buy max") {
        let tempUpgrades = upgrades[value];
        let tempCoins = coins;
        let tempUpgradesCost = upgradesCost[value];
        while (tempCoins >= tempUpgradesCost) {
          tempCoins -= tempUpgradesCost;
          tempUpgradesCost = upgradesFormulas[value](tempUpgradesCost, tempUpgrades);
          tempUpgrades += 1;
        }
        setCoins(tempCoins);
        setUpgradesCost({...upgradesCost, [value]: tempUpgradesCost});
        setUpgrades({...upgrades, [value]: tempUpgrades});
      }
    }
  }
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

  useEffect(() => {
    const autoClick = setInterval(() => setCoins((prev) => prev + upgrades.autoCoins), 1000);
    return () => clearInterval(autoClick);
  }, [upgrades.autoCoins]);
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
      <Shop 
      handleBuy={handleBuy}
      upgradesCost={upgradesCost}
      coins={coins}
      />
      <hr/>
      <button onClick={handleReset}>Reset</button>
    </>
  )
}