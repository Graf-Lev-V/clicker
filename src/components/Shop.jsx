export default function Shop({ handleBuyClickPower, upgradeClickPowerCost, handleBuyAutoCoin, upgradeAutoCoinCost, coins }) {
    return (
        <>
            <p>Click Power Upgrade</p>
            <p>Cost: {upgradeClickPowerCost} coins.</p>
            <button onClick={() => handleBuyClickPower("Buy")} disabled={coins < upgradeClickPowerCost}>Buy</button>
            <button onClick={() => handleBuyClickPower("Buy max")} disabled={coins < upgradeClickPowerCost}>Buy max</button>
            <p>Auto Coins Upgrade</p>
            <p>Cost: {upgradeAutoCoinCost} coins.</p>
            <button onClick={() => handleBuyAutoCoin("Buy")} disabled={coins < upgradeAutoCoinCost}>Buy</button>
            <button onClick={() => handleBuyAutoCoin("Buy max")} disabled={coins < upgradeAutoCoinCost}>Buy max</button>
        </>
    )
}