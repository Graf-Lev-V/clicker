export default function Shop({handleBuy, upgradesCost, coins }) {
    return (
        <>
            <p>Click Power Upgrade</p>
            <p>Cost: {upgradesCost.clickPower} coins.</p>
            <button onClick={() => handleBuy("Buy", "clickPower")} disabled={coins < upgradesCost.clickPower}>Buy</button>
            <button onClick={() => handleBuy("Buy max", "clickPower")} disabled={coins < upgradesCost.clickPower}>Buy max</button>
            <p>Auto Coins Upgrade</p>
            <p>Cost: {upgradesCost.autoCoins} coins.</p>
            <button onClick={() => handleBuy("Buy", "autoCoins")} disabled={coins < upgradesCost.autoCoins}>Buy</button>
            <button onClick={() => handleBuy("Buy max", "autoCoins")} disabled={coins < upgradesCost.autoCoins}>Buy max</button>
        </>
    )
}