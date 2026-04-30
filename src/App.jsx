import { useEffect, useState } from 'react'
import ClickButton from "./components/ClickButton"
import Stats from "./components/Stats"
import Shop from "./components/Shop"

const upgradesConfig = {
  clickPower: {
    nextCost: (level) => Math.floor(10 * (level + 1) ** 1.3),
    baseValue: 1,
    nextUpgrade: (level) => 1 + level * 1,
    key: "clickPower", 
    title: "Click Power",
    description: "+1 coin per click",
    nextLevel: (state) => ({...state, clickPower: state.clickPower + 1})
  },
  autoCoins: {
    nextCost: (level) => Math.floor(25 * (level + 1) ** 1.4),
    baseValue: 0,
    nextUpgrade: (level) => 0 + level * 1,
    key: "autoCoins", 
    title: "Auto Coins",
    description: "+1 coin per second",
    nextLevel: (state) => ({...state, autoCoins: state.autoCoins + 1})
  },
  coinMultiplier: {
    nextCost: (level) => Math.floor(70 * 1.7 ** level),
    baseValue: 1,
    nextUpgrade: (level) => 1 + level * 1,
    key: "coinMultiplier",
    title: "Coin Multiplier",
    description: `x2 coins per click`,
    nextLevel: (state) => ({...state, coinMultiplier: state.coinMultiplier + 1})
  },
  autoCoinsMultiplier: {
    nextCost: (level) => Math.floor(140 * 1.6 ** level),
    baseValue: 1,
    nextUpgrade: (level) => 1 + level * 1,
    key: "autoCoinsMultiplier",
    title: "Auto Coins Multiplier",
    description: `x2 coins per second`,
    nextLevel: (state) => ({...state, autoCoinsMultiplier: state.autoCoinsMultiplier + 1})
  },
  critChance: {
    nextCost: (level) => Math.floor(80 * 1.5 ** level),
    baseValue: 0,
    nextUpgrade: (level) => 0 + level * 0.05,
    key: "critChance",
    title: "Crit Chance",
    description: "+5% chance coins multiplied per click",
    nextLevel: (state) => ({...state, critChance: state.critChance + 1})
  },
  critPower: {
    nextCost: (level) => Math.floor(120 * 1.4 ** level),
    baseValue: 2,
    nextUpgrade: (level) => 2 + level * 0.5,
    key: "critPower",
    title: "Crit Power",
    description: "x2 coins multiplied per crit",
    nextLevel: (state) => ({...state, critPower: state.critPower + 1})
  }
}

export default function App() {

  //coins
  const [coins, setCoins] = useState(Number(localStorage.getItem("coins")) || 0);

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
    const autoClick = setInterval(() => setCoins((prev) => 
      prev + 
      (upgradesConfig.autoCoins.nextUpgrade(upgradeLevel.autoCoins) * 
      upgradesConfig.autoCoinsMultiplier.nextUpgrade(upgradeLevel.autoCoinsMultiplier))), 1000);
    return () => clearInterval(autoClick);
  }, [upgradeLevel.autoCoins, upgradeLevel.autoCoinsMultiplier]);

  //click
  function handleClick() {
    if (Math.random() <= upgradesConfig.critChance.nextUpgrade(upgradeLevel.critChance)) {
      setCrit(true);
      setCoins((prev) => 
        prev + 
        (upgradesConfig.clickPower.nextUpgrade(upgradeLevel.clickPower) * 
        upgradesConfig.coinMultiplier.nextUpgrade(upgradeLevel.coinMultiplier) * 
        upgradesConfig.critPower.nextUpgrade(upgradeLevel.critPower)))
    } 
    else  {
      setCrit(false);
      setCoins((prev) => 
        prev + 
        (upgradesConfig.clickPower.nextUpgrade(upgradeLevel.clickPower) * 
        upgradesConfig.coinMultiplier.nextUpgrade(upgradeLevel.coinMultiplier)))
    }
  }

  //buy
  function handleBuy(count, upgradeKey) {
    if (coins >= upgradesConfig[upgradeKey].nextCost(upgradeLevel[upgradeKey])) {
      if (count === "one") {
        setCoins((prev) => prev - upgradesConfig[upgradeKey].nextCost(upgradeLevel[upgradeKey]));
        setUpgradeLevel(upgradesConfig[upgradeKey].nextLevel(upgradeLevel));
      }
      if (count === "max") {
        let tempCoins = coins;
        let tempCost = upgradesConfig[upgradeKey].nextCost(upgradeLevel[upgradeKey]);
        let tempLevel = {...upgradeLevel};
        while (tempCost <= tempCoins) {
          tempCoins -= tempCost;
          tempCost = upgradesConfig[upgradeKey].nextCost(tempLevel[upgradeKey] + 1);
          tempLevel = upgradesConfig[upgradeKey].nextLevel(tempLevel);
        }
        setCoins(tempCoins);
        setUpgradeLevel(tempLevel);
      }
    }
  }

  //reset
  function handleReset() {
    localStorage.clear();
    setCoins(0);
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
    localStorage.setItem("upgradeLevel", JSON.stringify(upgradeLevel));
  }, [coins, upgradeLevel])

  

  return (
    <>
      <ClickButton 
      handleClick={handleClick} 
      clickPower={upgradesConfig.clickPower.nextUpgrade(upgradeLevel.clickPower)} 
      coinMultiplier={upgradesConfig.coinMultiplier.nextUpgrade(upgradeLevel.coinMultiplier)}
      critPower={upgradesConfig.critPower.nextUpgrade(upgradeLevel.critPower)}
      crit={crit}/>
      <hr/>
      <p>Coins: {coins}</p>
      <hr/>
      <Stats 
      coins={coins} 
      clickPower={upgradesConfig.clickPower.nextUpgrade(upgradeLevel.clickPower)} 
      autoCoins={upgradesConfig.autoCoins.nextUpgrade(upgradeLevel.autoCoins)}
      coinMultiplier={upgradesConfig.coinMultiplier.nextUpgrade(upgradeLevel.coinMultiplier)}
      autoCoinsMultiplier={upgradesConfig.autoCoinsMultiplier.nextUpgrade(upgradeLevel.autoCoinsMultiplier)}
      critChance={upgradesConfig.critChance.nextUpgrade(upgradeLevel.critChance)}
      critPower={upgradesConfig.critPower.nextUpgrade(upgradeLevel.critPower)}/>
      <hr/>
      {Object.values(upgradesConfig).map((upgrade) => <Shop 
        key={upgrade.key}
        handleBuy={handleBuy}
        upgradeCost={upgradesConfig[upgrade.key].nextCost(upgradeLevel[upgrade.key])}
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