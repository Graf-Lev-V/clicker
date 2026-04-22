export default function Stats({ upgrades}) {
    return (
        <>
            <p>Click Power: {upgrades.clickPower} c/c</p>
            <p>Auto Coins: {upgrades.autoCoins} c/s</p>
            <p>Coin Multiplier: {upgrades.coinMultiplier}x</p>
            <p>Auto Coins Multiplier: {upgrades.autoCoinsMultiplier}x</p>
            <p>Crit Chance: {upgrades.critChance * 100}%</p>
            <p>Crit Power: {upgrades.critPower}x</p>
        </>
    )
}