import { useEffect, useState } from 'react'
import ClickButton from "./components/ClickButton"
import Stats from "./components/Stats"
import Shop from "./components/Shop"

const upgradesConfig = {
  clickPower: {
    nextCost: (level) => Math.floor(10 * (level + 1) ** 1.3),
    nextUpgrade: (state) => ({...state, clickPower: state.clickPower + 1}),
    key: "clickPower", 
    title: "Click Power",
    description: "+1 coin per click",
    nextLevel: (state) => ({...state, clickPower: state.clickPower + 1})
  },
  autoCoins: {
    nextCost: (level) => Math.floor(25 * (level + 1) ** 1.4),
    nextUpgrade: (state) => ({...state, autoCoins: state.autoCoins + 1}),
    key: "autoCoins", 
    title: "Auto Coins",
    description: "+1 coin per second",
    nextLevel: (state) => ({...state, autoCoins: state.autoCoins + 1})
  },
  coinMultiplier: {
    nextCost: (level) => Math.floor(70 * 1.7 ** level),
    nextUpgrade: (state) => ({...state, coinMultiplier: state.coinMultiplier + 1}),
    key: "coinMultiplier",
    title: "Coin Multiplier",
    description: `x2 coins per click`,
    nextLevel: (state) => ({...state, coinMultiplier: state.coinMultiplier + 1})
  },
  autoCoinsMultiplier: {
    nextCost: (level) => Math.floor(140 * 1.6 ** level),
    nextUpgrade: (state) => ({...state, autoCoinsMultiplier: state.autoCoinsMultiplier + 1}),
    key: "autoCoinsMultiplier",
    title: "Auto Coins Multiplier",
    description: `x2 coins per second`,
    nextLevel: (state) => ({...state, autoCoinsMultiplier: state.autoCoinsMultiplier + 1})
  },
  critChance: {
    nextCost: (level) => Math.floor(80 * 1.5 ** level),
    nextUpgrade: (state) => ({...state, critChance: state.critChance + 0.05}),
    key: "critChance",
    title: "Crit Chance",
    description: "+5% chance coins multiplied per click",
    nextLevel: (state) => ({...state, critChance: state.critChance + 1})
  },
  critPower: {
    nextCost: (level) => Math.floor(120 * 1.4 ** level),
    nextUpgrade: (state) => ({...state, critPower: state.critPower + 0.5}),
    key: "critPower",
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

  //upgrades cost
  const [upgradeCost, setUpgradeCost] = useState( 
    localStorage.getItem("upgradeCost") ? JSON.parse(localStorage.getItem("upgradeCost")) : 
    { 
    clickPower: 10, 
    autoCoins: 25, 
    coinMultiplier: 70, 
    autoCoinsMultiplier: 140, 
    critChance: 80, 
    critPower: 120 
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
        setUpgradeCost({...upgradeCost, [upgradeKey]: upgradesConfig[upgradeKey].nextCost(upgradeLevel[upgradeKey] + 1)});
        setUpgrades(upgradesConfig[upgradeKey].nextUpgrade(upgrades));
        setUpgradeLevel(upgradesConfig[upgradeKey].nextLevel(upgradeLevel));
      }
      if (count === "max") {
      
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
    });
    setUpgradeCost({ 
    clickPower: 10, 
    autoCoins: 25, 
    coinMultiplier: 70, 
    autoCoinsMultiplier: 140, 
    critChance: 80, 
    critPower: 120 
    });
    setUpgradeLevel({
      clickPower: 0,
      autoCoins: 0,
      coinMultiplier: 0,
      autoCoinsMultiplier: 0,
      critChance: 0,
      critPower: 0
    });
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
      {Object.values(upgradesConfig).map((upgrade) => <Shop 
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