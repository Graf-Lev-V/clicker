import { useEffect, useState } from 'react'
import ClickButton from "./components/ClickButton"
import Stats from "./components/Stats"
import Shop from "./components/Shop"

const upgradesConfig = {
  clickPower: {
    baseCost: 10,
    nextCost: (level) => Math.floor(10 * (level + 1) ** 1.3),
    nextUpgrade: (state) => ({...state, clickPower: state.clickPower + 1}),
    key: "clickPower", 
    title: "Click Power",
    description: "+1 coin per click",
    nextLevel: (state) => ({...state, clickPower: state.clickPower + 1})
  },
  autoCoins: {
    baseCost: 25,
    nextCost: (level) => Math.floor(25 * (level + 1) ** 1.4),
    nextUpgrade: (state) => ({...state, autoCoins: state.autoCoins + 1}),
    key: "autoCoins", 
    title: "Auto Coins",
    description: "+1 coin per second",
    nextLevel: (state) => ({...state, autoCoins: state.autoCoins + 1})
  },
  coinMultiplier: {
    baseCost: 70,
    nextCost: (level) => Math.floor(70 * 1.7 ** level),
    nextUpgrade: (state) => ({...state, coinMultiplier: state.coinMultiplier + 1}),
    key: "coinMultiplier",
    title: "Coin Multiplier",
    description: `x2 coins per click`,
    nextLevel: (state) => ({...state, coinMultiplier: state.coinMultiplier + 1})
  },
  autoCoinsMultiplier: {
    baseCost: 140,
    nextCost: (level) => Math.floor(140 * 1.6 ** level),
    nextUpgrade: (state) => ({...state, autoCoinsMultiplier: state.autoCoinsMultiplier + 1}),
    key: "autoCoinsMultiplier",
    title: "Auto Coins Multiplier",
    description: `x2 coins per second`,
    nextLevel: (state) => ({...state, autoCoinsMultiplier: state.autoCoinsMultiplier + 1})
  },
  critChance: {
    baseCost: 80,
    nextCost: (level) => Math.floor(80 * 1.5 ** level),
    nextUpgrade: (state) => ({...state, critChance: state.critChance + 0.05}),
    key: "critChance",
    title: "Crit Chance",
    description: "+5% chance coins multiplied per click",
    nextLevel: (state) => ({...state, critChance: state.critChance + 1})
  },
  critPower: {
    baseCost: 120,
    nextCost: (level) => Math.floor(120 * 1.4 ** level),
    nextUpgrade: (state) => ({...state, critPower: state.critPower + 0.5}),
    key: "critChance",
    title: "Crit Chance",
    description: "+5% chance coins multiplied per click",
    nextLevel: (state) => ({...state, critPower: state.critPower + 1})
  }
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

  //on crit
  const [crit, setCrit] = useState(false);

  //auto coins 
  useEffect(() => {
    const autoClick = setInterval(() => setCoins((prev) => prev + (upgrades.autoCoins * upgrades.autoCoinsMultiplier)), 1000);
    return () => clearInterval(autoClick);
  }, [upgrades.autoCoins, upgrades.autoCoinsMultiplier]);

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

  //buy
  function handleBuy(count, upgradeKey) {
    if (coins >= upgradeCost[upgradeKey]) {
      if (count === "one") {
        setCoins(coins - upgradeCost[upgradeKey]);
        setUpgradesCost({...upgradeCost, [upgradeKey]: upgradesFormulas[upgradeKey](upgradeLevel[upgradeKey] + 1)});

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