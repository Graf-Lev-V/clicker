export default function Shop({handleBuy, upgradeCost, coins, upgrade, upgradeLevel }) {
    return (
        <>
            <p>{upgrade.title} Upgrade (Lv. {upgradeLevel[upgrade.key]})</p>
            <p>{upgrade.description}</p>
            <p>Cost: {upgradeCost[upgrade.key]} coins.</p>
            <button onClick={() => handleBuy("one", upgrade.key)} disabled={coins < upgradeCost[upgrade.key]}>Buy</button>
            <button onClick={() => handleBuy("max", upgrade.key)} disabled={coins < upgradeCost[upgrade.key]}>Buy max</button>
        </>
    )
}