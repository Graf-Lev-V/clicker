import { useEffect, useState } from 'react'
import ClickButton from "./components/ClickButton"
import Stats from "./components/Stats"
import Shop from "./components/Shop"

//upgrades formulas
const upgradesFormulas = {
    clickPower: (cost, upgrade) => cost + (upgrade * 5),
    autoCoins: (cost) => Math.floor(cost * 1.5),
    coinMultiplier: (cost) => Math.floor(cost * 2),
    autoCoinsMultiplier: (cost) => Math.floor(cost * 2),
    critChance: (cost) => Math.floor(cost * 1.7)
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
    coinMultiplier: 1,
    autoCoinsMultiplier: 1,
    critChance: 0
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
    },
    {
      key: "autoCoinsMultiplier",
      title: "Auto Coins Multiplier",
      description: `x${upgrades.autoCoinsMultiplier + 1} coins per second`
    },
    {
      key: "critChance",
      title: "Crit Chance",
      description: "+5% chance coins doubled per click"
    }
  ]

  //upgrades cost
  const [upgradeCost, setUpgradesCost] = useState(
    localStorage.getItem("upgradeCost") ? JSON.parse(localStorage.getItem("upgradeCost")) :
    {
    clickPower: 10,
    autoCoins: 50,
    coinMultiplier: 100,
    autoCoinsMultiplier: 200,
    critChance: 150
  })

  //upgrades levels
  const [upgradeLevel, setUpgradeLevel] = useState(
    localStorage.getItem("upgradeLevel") ? JSON.parse(localStorage.getItem("upgradeLevel")) :
    {
    clickPower: 0,
    autoCoins: 0,
    coinMultiplier: 0,
    autoCoinsMultiplier: 0,
    critChance: 0
  })

  //click
  function handleClick() {
    let crit = 1;
    if (Math.floor(Math.random() <= upgrades.critChance)) crit += 1;
    setCoins((prev) => prev + (upgrades.clickPower * upgrades.coinMultiplier * crit));
  }

  //auto coins 
  useEffect(() => {
    const autoClick = setInterval(() => setCoins((prev) => prev + (upgrades.autoCoins * upgrades.autoCoinsMultiplier)), 1000);
    return () => clearInterval(autoClick);
  }, [upgrades.autoCoins, upgrades.autoCoinsMultiplier]);

  //buy
  function handleBuy(count, upgradeKey) {
    if (coins >= upgradeCost[upgradeKey]) {
      if (count === "one") {
        setCoins(coins - upgradeCost[upgradeKey]);
        setUpgradesCost({...upgradeCost, [upgradeKey]: upgradesFormulas[upgradeKey](upgradeCost[upgradeKey], upgrades[upgradeKey])});
        upgradeKey === "critChance" ? setUpgrades({...upgrades, [upgradeKey]: upgrades[upgradeKey] + 0.05}) : setUpgrades({...upgrades, [upgradeKey]: upgrades[upgradeKey] + 1});
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
          upgradeKey === "critChance" ? tempUpgrades += 0.05 : tempUpgrades += 1;
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
      coinMultiplier: 1,
      autoCoinsMultiplier: 1,
      critChance: 0
    })
    setUpgradesCost({
      clickPower: 10,
      autoCoins: 50,
      coinMultiplier: 100,
      autoCoinsMultiplier: 200,
      critChance: 150
    })
    setUpgradeLevel({
      clickPower: 0,
      autoCoins: 0,
      coinMultiplier: 0,
      autoCoinsMultiplier: 0,
      critChance: 0
    })
  }

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