export default function Stats({ coins, upgrades}) {
    return (
        <>
            <p>Coins: {coins}</p>
            <p>Click Power: {upgrades.clickPower}</p>
            <p>Auto Coins: {upgrades.autoCoins}</p>
            <p>Coin Multiplier: {upgrades.coinMultiplier}</p>
            <p>Auto Coins Multiplier: {upgrades.autoCoinsMultiplier}</p>
            <p>Crit Chance: {upgrades.critChance}</p>
            <p>Crit Power: {upgrades.critPower}</p>
        </>
    )
}