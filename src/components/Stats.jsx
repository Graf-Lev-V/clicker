export default function Stats({ clickPower, autoCoins, coinMultiplier, autoCoinsMultiplier, critChance, critPower}) {
    return (
        <>
            <p>Click Power: {clickPower} c/c</p>
            <p>Auto Coins: {autoCoins} c/s</p>
            <p>Coin Multiplier: {coinMultiplier}x</p>
            <p>Auto Coins Multiplier: {autoCoinsMultiplier}x</p>
            <p>Crit Chance: {critChance * 100}%</p>
            <p>Crit Power: {critPower}x</p>
        </>
    )
}