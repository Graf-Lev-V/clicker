import { useEffect, useState } from 'react'
import ClickButton from "./components/ClickButton"
import Stats from "./components/Stats"
import Shop from "./components/Shop"

//base cost
const baseCost = {
  clickPower: 10,
  autoCoins: 25,
  coinMultiplier: 70,
  autoCoinsMultiplier: 140,
  critChance: 80,
  critPower: 120
}

//upgrades formulas
const upgradesFormulas = {
    clickPower: (level) => Math.floor(baseCost.clickPower * (level + 1) ** 1.3),
    autoCoins: (level) => Math.floor(baseCost.autoCoins * (level + 1) ** 1.4),
    coinMultiplier: (level) => Math.floor(baseCost.coinMultiplier * 1.7 ** level),
    autoCoinsMultiplier: (level) => Math.floor(baseCost.autoCoinsMultiplier * 1.6 ** level),
    critChance: (level) => Math.floor(baseCost.critChance * 1.5 ** level),
    critPower: (level) => Math.floor(baseCost.critPower * 1.4 ** level)
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
    critChance: 0,
    critPower: 2
  })

   //upgrades cost
  const [upgradeCost, setUpgradesCost] = useState(
    localStorage.getItem("upgradeCost") ? JSON.parse(localStorage.getItem("upgradeCost")) : baseCost)

  //upgrades levels
  const [upgradeLevel, setUpgradeLevel] = useState(
    localStorage.getItem("upgradeLevel") ? JSON.parse(localStorage.getItem("upgradeLevel")) :
    {
    clickPower: 0,
    autoCoins: 0,
    coinMultiplier: 0,
    autoCoinsMultiplier: 0,
    critChance: 0,
    critPower: 0
  })

  const [crit, setCrit] = useState(false);

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
      description: "+5% chance coins multiplied per click"
    },
    {
      key: "critPower",
      title: "Crit Power",
      description: `x${upgrades.critPower + 0.5} coins multiplied per crit`
    }
  ]

  //click
  function handleClick() {
    if (Math.random() <= upgrades.critChance) {
      setCrit(true);
      setCoins((prev) => prev + (upgrades.clickPower * upgrades.coinMultiplier * upgrades.critPower))
    } 
    else  {
      setCrit(false);
      setCoins((prev) => prev + (upgrades.clickPower * upgrades.coinMultiplier))
    }
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
        setUpgradesCost({...upgradeCost, [upgradeKey]: upgradesFormulas[upgradeKey](upgradeLevel[upgradeKey])});

        console.log(upgradesFormulas[upgradeKey](upgradeLevel[upgradeKey]))

        upgradeKey === "critChance" ? 
        setUpgrades({...upgrades, [upgradeKey]: upgrades[upgradeKey] + 0.05}) : 
        upgradeKey === "critPower" ? 
        setUpgrades({...upgrades, [upgradeKey]: upgrades[upgradeKey] + 0.5}) : 
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
          tempUpgradesCost = upgradesFormulas[upgradeKey](tempUpgradeLevel);
          
          upgradeKey === "critChance" ? 
          tempUpgrades += 0.05 : 
          upgradeKey === "critPower" ? 
          tempUpgrades += 0.5 : 
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
      coinMultiplier: 1,
      autoCoinsMultiplier: 1,
      critChance: 0,
      critPower: 2
    })

    setUpgradesCost(baseCost);

    setUpgradeLevel({
      clickPower: 0,
      autoCoins: 0,
      coinMultiplier: 0,
      autoCoinsMultiplier: 0,
      critChance: 0,
      critPower: 0
    })
  }

  //debug
  function manyCoins() {
    setCoins(1000000000000);
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
      <ClickButton handleClick={handleClick} upgrades={upgrades} crit={crit}/>
      <hr/>
      <p>Coins: {coins}</p>
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
      <button onClick={manyCoins}>Give Coins</button>
    </>
  )
}