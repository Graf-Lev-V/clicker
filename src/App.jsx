import { useEffect, useState } from 'react'
import ClickButton from "./components/ClickButton"
import Stats from "./components/Stats"
import Shop from "./components/Shop"

//upgrades formulas
const upgradesFormulas = {
    clickPower: (cost, upgrade) => cost + (upgrade * 5),
    autoCoins: (cost) => Math.floor(cost * 1.5),
    coinMultiplier: (cost) => Math.floor(cost * 2)
}

export default function App() {

  //coins
  const [coins, setCoins] = useState(Number(localStorage.getItem("coins")) || 0);

  //upgrades
  const [upgrades, setUpgrades] = useState(
    localStorage.getItem("upgrades") ? JSON.parse(localStorage.getItem("upgrades")) :
    {
    clickPower: 1,
    autoCoins: 0,
    coinMultiplier: 1
  })

  //shop upgrades
  const shop = [
    {
      key: "clickPower", 
      title: "Click Power",
      description: "+1 coin per click"
    }, 
    {
      key: "autoCoins", 
      title: "Auto Coins",
      description: "+1 coin per second"
    },
    {
      key: "coinMultiplier",
      title: "Coin Multiplier",
      description: `x${upgrades.coinMultiplier + 1} coins per click`
    }
  ]

  //upgrades cost
  const [upgradeCost, setUpgradesCost] = useState(
    localStorage.getItem("upgradeCost") ? JSON.parse(localStorage.getItem("upgradeCost")) :
    {
    clickPower: 10,
    autoCoins: 50,
    coinMultiplier: 100
  })

  //upgrades levels
  const [upgradeLevel, setUpgradeLevel] = useState(
    localStorage.getItem("upgradeLevel") ? JSON.parse(localStorage.getItem("upgradeLevel")) :
    {
    clickPower: 0,
    autoCoins: 0,
    coinMultiplier: 0
  })

  //click
  function handleClick() {
    setCoins((prev) => prev + (upgrades.clickPower * upgrades.coinMultiplier));
  }

  //buy
  function handleBuy(count, upgradeKey) {
    if (coins >= upgradeCost[upgradeKey]) {
      if (count === "one") {
        setCoins(coins - upgradeCost[upgradeKey]);
        setUpgradesCost({...upgradeCost, [upgradeKey]: upgradesFormulas[upgradeKey](upgradeCost[upgradeKey], upgrades[upgradeKey])});
        setUpgrades({...upgrades, [upgradeKey]: upgrades[upgradeKey] + 1});
        setUpgradeLevel({...upgradeLevel, [upgradeKey]: upgradeLevel[upgradeKey] + 1})
      }
      if (count === "max") {
        let tempUpgrades = upgrades[upgradeKey];
        let tempCoins = coins;
        let tempUpgradesCost = upgradeCost[upgradeKey];
        let tempUpgradeLevel = upgradeLevel[upgradeKey];
        while (tempCoins >= tempUpgradesCost) {
          tempCoins -= tempUpgradesCost;
          tempUpgradesCost = upgradesFormulas[upgradeKey](tempUpgradesCost, tempUpgrades);
          tempUpgrades += 1;
          tempUpgradeLevel += 1;
        }
        setCoins(tempCoins);
        setUpgradesCost({...upgradeCost, [upgradeKey]: tempUpgradesCost});
        setUpgrades({...upgrades, [upgradeKey]: tempUpgrades});
        setUpgradeLevel({...upgradeLevel, [upgradeKey]: tempUpgradeLevel})
      }
    }
  }

  //reset
  function handleReset() {
    localStorage.clear();
    setCoins(0);
    setUpgrades({
      clickPower: 1,
      autoCoins: 0,
      coinMultiplier: 1
    })
    setUpgradesCost({
      clickPower: 10,
      autoCoins: 50,
      coinMultiplier: 100
    })
    setUpgradeLevel({
      clickPower: 0,
      autoCoins: 0,
      coinMultiplier: 0
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
    localStorage.setItem("upgrades", JSON.stringify(upgrades));
    localStorage.setItem("upgradeCost", JSON.stringify(upgradeCost));
    localStorage.setItem("upgradeLevel", JSON.stringify(upgradeLevel));
  }, [coins, upgrades, upgradeCost, upgradeLevel])

  return (
    <>
      <ClickButton handleClick={handleClick} upgrades={upgrades}/>
      <hr/>
      <Stats coins={coins} upgrades={upgrades}/>
      <hr/>
      {shop.map((upgrade) => <Shop 
        key={upgrade.key}
        handleBuy={handleBuy}
        upgradeCost={upgradeCost}
        coins={coins}
        upgrade={upgrade}
        upgradeLevel={upgradeLevel}
        />
      )}    
      <hr/>
      <button onClick={handleReset}>Reset</button>
    </>
  )
}