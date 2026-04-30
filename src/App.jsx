import { useEffect, useState } from 'react'
import ClickButton from "./components/ClickButton"
import Stats from "./components/Stats"
import Shop from "./components/Shop"

const upgradesConfig = {
  clickPower: {
    nextCost: (level) => Math.floor(10 * (level + 1) ** 1.3),
    baseValue: 1,
    getValue: (level) => 1 + level * 1,
    title: "Click Power",
    description: "+1 coin per click",
  },
  autoCoins: {
    nextCost: (level) => Math.floor(25 * (level + 1) ** 1.4),
    baseValue: 0,
    getValue: (level) => 0 + level * 1,
    title: "Auto Coins",
    description: "+1 coin per second",
  },
  coinMultiplier: {
    nextCost: (level) => Math.floor(70 * 1.7 ** level),
    baseValue: 1,
    getValue: (level) => 1 + level * 1,
    title: "Coin Multiplier",
    description: `x2 coins per click`,
  },
  autoCoinsMultiplier: {
    nextCost: (level) => Math.floor(140 * 1.6 ** level),
    baseValue: 1,
    getValue: (level) => 1 + level * 1,
    title: "Auto Coins Multiplier",
    description: `x2 coins per second`,
  },
  critChance: {
    nextCost: (level) => Math.floor(80 * 1.5 ** level),
    baseValue: 0,
    getValue: (level) => 0 + level * 0.05,
    title: "Crit Chance",
    description: "+5% chance coins multiplied per click",
  },
  critPower: {
    nextCost: (level) => Math.floor(120 * 1.4 ** level),
    baseValue: 2,
    getValue: (level) => 2 + level * 0.5,
    title: "Crit Power",
    description: "x2 coins multiplied per crit",
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
  });

  //crit
  const [crit, setCrit] = useState(false);

  const values = {
    clickPower: upgradesConfig.clickPower.getValue(upgradeLevel.clickPower),
    autoCoins: upgradesConfig.autoCoins.getValue(upgradeLevel.autoCoins),
    coinMultiplier: upgradesConfig.coinMultiplier.getValue(upgradeLevel.coinMultiplier),
    autoCoinsMultiplier: upgradesConfig.autoCoinsMultiplier.getValue(upgradeLevel.autoCoinsMultiplier),
    critChance: upgradesConfig.critChance.getValue(upgradeLevel.critChance),
    critPower: upgradesConfig.critPower.getValue(upgradeLevel.critPower)
  }

  //click
  function handleClick() {
    if (Math.random() <= values.critChance) {
      setCrit(true);
      setCoins((prev) => prev + (values.clickPower * values.coinMultiplier * values.critPower))
    } 
    else  {
      setCrit(false);
      setCoins((prev) => prev + (values.clickPower * values.coinMultiplier))
    }
  }

  //buy
  function handleBuy(count, upgradeKey) {
    if (coins >= upgradesConfig[upgradeKey].nextCost(upgradeLevel[upgradeKey])) {
      if (count === "one") {
        setCoins((prev) => prev - upgradesConfig[upgradeKey].nextCost(upgradeLevel[upgradeKey]));
        setUpgradeLevel((prev) => ({...prev, [upgradeKey]: prev[upgradeKey] + 1}));
      }
      if (count === "max") {
        let tempCoins = coins;
        let tempCost = upgradesConfig[upgradeKey].nextCost(upgradeLevel[upgradeKey]);
        let tempLevel = upgradeLevel[upgradeKey];
        while (tempCost <= tempCoins) {
          tempCoins -= tempCost;
          tempLevel += 1;
          tempCost = upgradesConfig[upgradeKey].nextCost(tempLevel);
        }
        setCoins(tempCoins);
        setUpgradeLevel({...upgradeLevel, [upgradeKey]: tempLevel});
      }
    }
  }

  //auto coins 
  useEffect(() => {
    const autoClick = setInterval(() => setCoins((prev) => prev + (values.autoCoins * values.autoCoinsMultiplier)), 1000);
    return () => clearInterval(autoClick);
  }, [values.autoCoins, values.autoCoinsMultiplier]);

  //local storage
  useEffect(() => {
    localStorage.setItem("coins", coins);
    localStorage.setItem("upgradeLevel", JSON.stringify(upgradeLevel));
  }, [coins, upgradeLevel]);

  return (
    <>
      <ClickButton 
        handleClick={handleClick} 
        clickPower={values.clickPower} 
        coinMultiplier={values.coinMultiplier}
        critPower={values.critPower}
        crit={crit}
      />
      <hr/>
      <p>Coins: {coins}</p>
      <hr/>
      <Stats 
        coins={coins} 
        clickPower={values.clickPower} 
        autoCoins={values.autoCoins}
        coinMultiplier={values.coinMultiplier}
        autoCoinsMultiplier={values.autoCoinsMultiplier}
        critChance={values.critChance}
        critPower={values.critPower}
      />
      <hr/>
      {Object.entries(upgradesConfig).map((key, upgrade) => <Shop 
        key={key}
        handleBuy={handleBuy}
        upgradeCost={upgradesConfig[key].nextCost(upgradeLevel[key])}
        coins={coins}
        upgrade={upgrade}
        upgradeLevel={upgradeLevel}
        />
      )}
      <hr/>
      
    </>
  )
}