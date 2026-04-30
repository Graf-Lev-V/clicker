export default function Shop({id, handleBuy, upgradeCost, coins, upgrade, upgradeLevel}) {
    return (
        <>
            <p>{upgrade.title} Upgrade (Lv. {upgradeLevel})</p>
            <p>{upgrade.description}</p>
            <p>Cost: {upgradeCost} coins.</p>
            <button onClick={() => handleBuy("one", id)} disabled={coins < upgradeCost}>Buy</button>
            <button onClick={() => handleBuy("max", id)} disabled={coins < upgradeCost}>Buy max</button>
        </>
    )
}